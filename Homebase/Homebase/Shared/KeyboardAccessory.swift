import SwiftUI
import UIKit

// MARK: - Keyboard-Style Shortcut Keys (inputAccessoryView)

/// UIInputView styled to match the iOS keyboard, containing shortcut key buttons.
/// Uses `.keyboard` inputViewStyle so the background auto-matches the keyboard chrome.
final class ShortcutKeysInputView: UIInputView {
    var onInsert: ((String) -> Void)?

    init() {
        super.init(frame: CGRect(x: 0, y: 0, width: 0, height: 44), inputViewStyle: .keyboard)
        autoresizingMask = .flexibleWidth
        buildKeys()
    }

    required init?(coder: NSCoder) { fatalError() }

    private func buildKeys() {
        let shortcuts: [(label: String, trigger: String, color: UIColor)] = [
            ("#",  "#",  .systemBlue),
            ("@",  "@",  .systemPurple),
            ("&",  "&",  .systemCyan),
            ("!",  "!",  .systemOrange),
            ("!!", "!!", .systemRed),
        ]

        let stack = UIStackView()
        stack.axis = .horizontal
        stack.distribution = .fillEqually
        stack.spacing = 5
        stack.translatesAutoresizingMaskIntoConstraints = false

        for sc in shortcuts {
            let btn = UIButton(type: .system)
            btn.setTitle(sc.label, for: .normal)
            btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
            btn.setTitleColor(sc.color, for: .normal)

            // iOS keyboard key cap style
            btn.backgroundColor = UIColor { tc in
                tc.userInterfaceStyle == .dark ? UIColor(white: 0.32, alpha: 1) : .white
            }
            btn.layer.cornerRadius = 5
            btn.layer.shadowColor = UIColor(white: 0, alpha: 1).cgColor
            btn.layer.shadowOffset = CGSize(width: 0, height: 1)
            btn.layer.shadowOpacity = 0.25
            btn.layer.shadowRadius = 0

            let trigger = sc.trigger
            btn.addAction(UIAction { [weak self] _ in
                self?.onInsert?(trigger)
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }, for: .touchUpInside)

            stack.addArrangedSubview(btn)
        }

        addSubview(stack)
        NSLayoutConstraint.activate([
            stack.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 4),
            stack.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -4),
            stack.topAnchor.constraint(equalTo: topAnchor, constant: 5),
            stack.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -5),
        ])
    }
}

// MARK: - SwiftUI View Modifier

extension View {
    /// Attaches keyboard-style shortcut keys (# @ & ! !!) as an inputAccessoryView
    /// to the nearest UITextField or UITextView in the view hierarchy.
    func shortcutKeysAccessory(onInsert: @escaping (String) -> Void) -> some View {
        background(
            ShortcutKeysInjector(onInsert: onInsert)
                .frame(width: 0, height: 0)
                .allowsHitTesting(false)
        )
    }
}

// MARK: - UIViewRepresentable Injector

/// A zero-frame UIView placed as a `.background` that finds the nearest UITextField/UITextView
/// and sets its `inputAccessoryView` to the keyboard-style shortcut keys row.
private struct ShortcutKeysInjector: UIViewRepresentable {
    let onInsert: (String) -> Void

    func makeUIView(context: Context) -> InjectorView {
        InjectorView(onInsert: onInsert)
    }

    func updateUIView(_ uiView: InjectorView, context: Context) {
        uiView.updateHandler(onInsert)
    }

    final class InjectorView: UIView {
        private var onInsert: (String) -> Void
        private var accessory: ShortcutKeysInputView?
        private var retryCount = 0

        init(onInsert: @escaping (String) -> Void) {
            self.onInsert = onInsert
            super.init(frame: .zero)
        }

        required init?(coder: NSCoder) { fatalError() }

        func updateHandler(_ handler: @escaping (String) -> Void) {
            onInsert = handler
            accessory?.onInsert = handler
        }

        override func didMoveToWindow() {
            super.didMoveToWindow()
            if window != nil && accessory == nil {
                tryInject()
            }
        }

        private func tryInject() {
            guard accessory == nil else { return }

            if let textInput = findNearestTextInput() {
                let acc = ShortcutKeysInputView()
                acc.onInsert = onInsert
                accessory = acc

                if let tf = textInput as? UITextField {
                    tf.inputAccessoryView = acc
                    tf.reloadInputViews()
                } else if let tv = textInput as? UITextView {
                    tv.inputAccessoryView = acc
                    tv.reloadInputViews()
                }
            } else if retryCount < 10 {
                retryCount += 1
                let delay = 0.05 * Double(retryCount)
                DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self] in
                    self?.tryInject()
                }
            }
        }

        /// Search outward from this view to find the nearest UITextField/UITextView.
        /// SwiftUI `.background()` places this view as a sibling, so checking siblings
        /// of each ancestor finds the correct text input.
        private func findNearestTextInput() -> UIView? {
            var ancestor: UIView? = superview
            while let v = ancestor {
                // Search children of this ancestor (excludes self)
                for child in v.subviews {
                    if let found = depthFirstTextInput(in: child) {
                        return found
                    }
                }
                ancestor = v.superview
            }
            return nil
        }

        private func depthFirstTextInput(in view: UIView) -> UIView? {
            if view is UITextField || view is UITextView {
                return view
            }
            for sub in view.subviews {
                if let found = depthFirstTextInput(in: sub) {
                    return found
                }
            }
            return nil
        }
    }
}
