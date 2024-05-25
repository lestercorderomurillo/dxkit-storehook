# Build the project
yarn build

# Add all changes to the Git index
git add .

# Push the changes to the remote repository
git push

# Publish the package
yarn publish --access public

# Pull the changes from the remote repository
git reset --hard HEAD