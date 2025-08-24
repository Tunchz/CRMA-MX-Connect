// install nvm on ubuntu

// 1 : run installer
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

// 2 : update profile configuration
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

// 3 : reload shell configuration
source ~/.bashrc
nvm -v




// *********** to run ip web service for VStarCam *********
// --- download WebViever webserver .exe windows executable file from https://doraemon.camera666.com/WebViewer >>> run on windows as server for commusicate with eye4 server.
// --- >>> to run on m1 mac use wine devel to run exe >>> download from https://github.com/Gcenx/macOS_Wine_builds/releases 

// --- >>> to run on server
//  1. upload program directory of WebViewer.exe (in windows's program file) to server
//  2. install wine
//      >> sudo apt updat
//      >> sudo apt install wine
//  ** in case of error for 32bit program install wine32
//      >> dpkg --add-architecture i386
//      >> sudo apt-get update
//      >> sudo apt-get install wine32
//  *** to fix ntlm_auth error or outdated
//      >> sudo apt install winbind
//  *** to run wine on server with no display install x server >>> xvfb
//      >> sudo apt install xorg xvfb xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic
//  NOTE:
//  normally to run exe >> wine app.exe (this work with display)
//  without display run >> xvfb-run wine app.exe

//  3. to run WebViewer.exe
//      >> xvfb-run wine WebViewer.exe
//  web socket run @ ws://<ip>:880
//  video can be access @ http://<ip>:813/<session>/<devID>/video.cgi?lens=0