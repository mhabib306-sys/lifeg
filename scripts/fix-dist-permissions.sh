#!/bin/bash
# Run with sudo. Fixes dist ownership for nginx.
chown -R www-data:www-data /var/www/myapp/lifeg/dist
chmod -R u+rX,g+rX,o+rX /var/www/myapp/lifeg/dist
