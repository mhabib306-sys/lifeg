# VPS Deployment Setup

When you push to `main`, GitHub Actions runs CI (tests, lint, build). If CI passes, it automatically deploys to your VPS.

## One-time setup

### 1. Add GitHub repository secrets

In your repo: **Settings → Secrets and variables → Actions**, add:

| Secret       | Value                                 | Description                          |
|-------------|----------------------------------------|--------------------------------------|
| `VPS_HOST`  | `46.101.197.104` (or your server IP)  | VPS hostname or IP                   |
| `VPS_USER`  | `muhammad`                             | SSH user (must own `/var/www/myapp`) |
| `VPS_SSH_KEY` | (private key contents)              | SSH private key for key-based auth   |

### 2. Create a deploy SSH key on the VPS

```bash
# On the VPS, as the deploy user (e.g. muhammad)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
```

Then copy the **private** key (`~/.ssh/github_deploy`) and paste it into the `VPS_SSH_KEY` secret.

### 3. Allow passwordless sudo for permissions script

The deploy script runs `sudo scripts/fix-dist-permissions.sh`. Add:

```bash
echo 'muhammad ALL=(ALL) NOPASSWD: /var/www/myapp/lifeg/scripts/fix-dist-permissions.sh' | sudo tee /etc/sudoers.d/lifeg-deploy
sudo chmod 440 /etc/sudoers.d/lifeg-deploy
```

### 4. Ensure repo exists on VPS

```bash
# On VPS
cd /var/www/myapp
git clone https://github.com/mhabib306-sys/lifeg.git
cd lifeg
npm install
chmod +x scripts/deploy-vps.sh
```

## Flow

1. You push to `main` → CI runs (tests, build)
2. If CI succeeds → Deploy workflow SSHs into VPS
3. Runs: `cd /var/www/myapp/lifeg && ./scripts/deploy-vps.sh`
4. Script: pulls, builds, fixes www-data permissions

## Manual deploy

```bash
cd /var/www/myapp/lifeg
npm run deploy:vps
```
