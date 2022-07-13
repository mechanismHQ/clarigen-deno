if ! [[ -z $(git status -s) ]]; then
  echo "Git is not clean. Exiting release"
  exit 1
fi
exit 0