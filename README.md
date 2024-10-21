[WARNING]  
If you're under Ubuntu v24, there is a [known issue](<[libwebkit2gtk-4.0-dev](https://github.com/tauri-apps/tauri/issues/9662)>) with `libwebkit2gtk-4.0-dev`.
You can follow this workaround in the meantime:
```sh
echo "deb http://archive.ubuntu.com/ubuntu jammy main" | sudo tee /etc/apt/sources.list.d/jammy.list
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev
sudo rm /etc/apt/sources.list.d/jammy.list
sudo apt update
```
It's not ideal but seem acceptable **only** for development purposes.