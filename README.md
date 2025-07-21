<p align="center">
  <img src="https://addons.mozilla.org/user-media/addon_icons/2755/2755484-64.png" alt="TradingViewPlus logo"></img>
  <br/>
  <sub>Take your charting experience to the next level.</sub>
</p>

<p align="center">
	<a href="https://addons.mozilla.org/en-US/firefox/addon/tradingviewplus/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get TradingViewPlus for Firefox"></a>
	<a href="https://chrome.google.com/webstore/detail/tradingviewplus/pkcgjgllebhppgegpedlhjmabmnpcpec?hl=en&authuser=0"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get TradingViewPlus for Chromium"></a>
	<a href=""><img src="https://user-images.githubusercontent.com/585534/107280692-ac7b5f00-6a26-11eb-85c7-088926504452.png" alt="Get TradingViewPlus for Opera"></a>
</p>

<h1 align="center">TradingViewPlus: Adds various features and quality of life improvements to TradingView™</h1>

## Features

Press "m" to open the menu

### Custom Features
- **Auto Timeframe Colors:**
> When active, automatically changes drawing colors depending on which timeframe is active.

- **Ad Blocker**
> When active, attempts to block all advertisements.

- **Change Line Style**
> Keybind to easily change a drawing's line style ( solid, dashed, etc. )

- **Change Line Width**
> Keybind to easily change a drawing's line width ( 1px, 2px, etc. )

- **Toggle TVP Menu**
> Keybind to toggle TradingViewPlus's built in side menu

- **Quick Toolbar**
> Gives quick access to the favorited tools toolbar using keys 1-9

- **Scroll Timeframes**
> When active, allows you to scroll through timeframes in order using Tab + Scroll

- **Scroll Price Scale**
> When active, allows you to scroll the chart's vertical scale using Shift + Scroll

- **Zoom Chart**
> When active, allows you to scroll BOTH of the chart's scales at the same time using Ctrl + Shift + Scroll


### Additional Editable Keybinds
- **Toggle Auto Scale**
- **Toggle Log Scale**
- **Delete Drawing**
- **Open Symbol Search**
- **Invert Scale**
- **Scroll To Most Recent Bar**
- **Move Time Left**
- **Move Time Right**

## Building
run `./build.sh firefox|chrome|opera` to build for firefox, chrome or opera respectively

### Building for Windows
Below is a README section tailored for a simple Windows user to set up WSL, install necessary dependencies, and run the `build.sh` script for the TradingviewPlus project. It assumes the user wants to replicate the original author’s setup without modifying the script and omits the `export MANIFEST_NAME` step since you noted it wasn’t needed.

#### Running the Build Script on Windows with WSL

This section guides Windows users through setting up Windows Subsystem for Linux (WSL), installing required dependencies, and running the `build.sh` script to build the TradingviewPlus extension (e.g., for Opera).

#### 1. Install Windows Subsystem for Linux (WSL)
1. Open **PowerShell** as Administrator:
   - Press `Win + S`, type `PowerShell`, right-click, and select "Run as administrator".
2. Install WSL with Ubuntu:
   ```powershell
   wsl --install
   ```
3. Restart your computer when prompted.
4. After restart, WSL will set up Ubuntu automatically. Set a username and password when prompted (e.g., username: `yourname`).
5. Verify WSL installation:
   ```bash
   wsl --list
   ```
   You should see `Ubuntu` listed. If not, run `wsl --install` again.

#### 2. Select WSL Environment
1. Open WSL by typing `wsl` in PowerShell or Command Prompt. This opens the Ubuntu terminal.
2. Update Ubuntu:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

#### 3. Install Relevant Modules
1. Install `zip` (used by the script):
   ```bash
   sudo apt install zip
   ```

#### 4. Install Node.js and Project Dependencies
1. Install Node Version Manager (`nvm`) to get a compatible Node.js version:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   source ~/.bashrc
   ```
2. Install Node.js v18 (a version likely used by the original author):
   ```bash
   nvm install 18
   nvm use 18
   ```
3. Verify Node.js and npm versions:
   ```bash
   node -v  # Should show v18.x.x
   npm -v
   ```
4. Navigate to your project folder (replace `yourname` with your Windows username):
   ```bash
   cd /mnt/c/Users/yourname/.vscode/Code/TradingviewPlus
   ```
5. Install project dependencies:
   ```bash
   npm install
   ```
6. Install `typescript` and `sass` (required by the script):
   ```bash
   npm install typescript sass
   ```

#### 5. Run the Build Script
1. Run the script with line-ending fix (replace `opera` with `firefox` or `chrome` if needed):
   ```bash
   cat build.sh | tr -d '\r' | bash -s opera
   ```
2. Check for the output file (`tvp-opera.zip`):
   ```bash
   ls -l tvp-opera.zip
   ```

## Testing
run `./web-ext.sh firefox|chrome|opera` to start web-ext for firefox, chrome or opera respectively

## Contributing

## Disclaimer
This software is provided for educational purposes only and is provided "AS IS", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. in no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
