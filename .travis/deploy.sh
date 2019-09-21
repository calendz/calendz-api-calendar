#!/bin/bash
eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 .travis/deploy_rsa # Allow read access to the private key
ssh-add .travis/deploy_rsa # Add the private key to SSH

# Execute the following commands through ssh
ssh -o "StrictHostKeyChecking=no" $SSH_USER@$SSH_IP -p $SSH_PORT <<EOF
  cd /home/calendz/calendz-conf
  git pull
  docker pull calendz/api-calendar:latest
  docker-compose -f docker/docker-compose.prod.yml stop calendz-api-calendar
  docker-compose -f docker/docker-compose.prod.yml rm -f calendz-api-calendar
  docker-compose -f docker/docker-compose.prod.yml up -d --no-deps --build calendz-api-calendar
  echo "successfully deployed" >> /home/calendz/deployed.txt
EOF