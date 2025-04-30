[[mac-workflow-optimization]]

Speed up dock animation:
```
defaults write com.apple.dock autohide-time-modifier -float 0 && killall Dock
```
Revert:
```
defaults delete com.apple.dock autohide-time-modifier && killall Dock
```