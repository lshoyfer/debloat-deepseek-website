const ENABLE_R1_ON_EVERY_PAGE_LOAD_OR_RELOAD = true;

document.addEventListener("DOMContentLoaded", injectHideStyles);
window.addEventListener("load", initBoost);

// Helps remove jarring page load when JS kicks in after full window load to remove stuff
// FIXME move this to CSS
function injectHideStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .a1e75851:has(.ds-icon svg), /* opened sidebar "Get App" text */
        [data-ds-dark-theme="dark"] .d65532b2,  /* opened sidebar "My Profile" text */
        :first-child > :first-child > :nth-child(2) > svg, /* opened sidebar text logo */
        #root > div > div.c3ecdb44 > div.dc04ec1d.a02af2e6 > div.a7f3a288.f0d4f23d > div.b91228e4, /* closed sidebar mobile icon */
        .a7f3a288 > .ds-icon:has(svg), /* closed sidebar logo icon */
        [data-ds-dark-theme="dark"] .fcaa63f8,  /* ai generated disclaimer on bottom */
        .c7e7df4d:has(.ds-icon svg), /* box above chatbox containing deepseek text and logo */
        #root > div > div.c3ecdb44 > div.f2eea526 > div > div > div.a2f8e4bb > div.aaff8b8f.eb830e32 > div > div > div.ec4f5d61 > div:nth-child(2) /* chatbox search button */ {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}


function initBoost() {
    console.log("[Boost] Initializing Boost")
    initCustomKeystrokeListeners();
    initUserStyles();
}

let oldEl = null;

const initUserStyles = () => {
    const handleOpenedSidebarSel = "#root > div > div.c3ecdb44 > div.dc04ec1d:not(.a02af2e6) > div.b8812f16.a2f3d50e";
    const handleClosedSidebarSel = "#root > div > div.c3ecdb44 > div.dc04ec1d.a02af2e6 > div.a7f3a288.f0d4f23d";
    const newChatWidthSel = "#root > div > div.c3ecdb44 > div.dc04ec1d > div.b8812f16.a2f3d50e > div.ebaea5d2 > div";
    const inputPlaceHolderSel = "chat-input";

    const homeSvgButton = `
        <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z" fill="currentColor"/>
        </svg>
    `;

    const openedSidebarHideSelectors = `
        .a1e75851:has(.ds-icon svg), /* opened sidebar "Get App" text */
        [data-ds-dark-theme="dark"] .d65532b2,  /* opened sidebar "My Profile" text */
        :first-child > :first-child > :nth-child(2) > svg /* opened sidebar text logo */
    `;
    
    const closedSidebarHideSelectors = `
        :nth-child(5):has(.ds-icon svg), /* closed sidebar mobile icon */
        .a7f3a288 > .ds-icon:has(svg) /* closed sidebar logo icon */
    `;
    
    const otherHideSelectors = `
        [data-ds-dark-theme="dark"] .fcaa63f8,  /* ai generated disclaimer on bottom */
        .c7e7df4d:has(.ds-icon svg), /* box above chatbox containing deepseek text and logo */
        #root > div > div.c3ecdb44 > div.f2eea526 > div > div > div.a2f8e4bb > div.aaff8b8f.eb830e32 > div > div > div.ec4f5d61 > div:nth-child(2) /* chatbox search button */
    `;
    

    // FIXME move this to CSS
    const changeTextToBlack = e => e.currentTarget.style.setProperty("--local-button-text", "black");
    const changeTextToDefault = e => e.currentTarget.style.setProperty("--local-button-text", "rgb(var(--ds-rgb-slate-50))");

    /// param must be a non-null and valid HTMLElement
    const applyHoverListeners = (el) => {
        el.addEventListener("mouseenter", changeTextToBlack);
        el.addEventListener("mouseleave", changeTextToDefault);
    }

    /// param must be a non-null and valid HTMLElement
    const removeHoverListeners = (el) => {
        el.removeEventListener("mouseenter", changeTextToBlack);
        el.removeEventListener("mouseleave", changeTextToDefault);
    }

    // FIXME move this to CSS if possible
    const applyOpenedNewChatWidthStyle = () => {
        if (oldEl !== null) {
            removeHoverListeners(oldEl)
        }

        let el = document.querySelector(newChatWidthSel);
        if (el !== null) {
        el.style.width = "90%";
        el.style.setProperty("--local-button-hover", "#cecdcd");
            applyHoverListeners(el)
        }

        oldEl = el;
    }

    const applyChatInputStylesAndState = () => {
        const chatInput = document.getElementById(inputPlaceHolderSel);
        chatInput.placeholder = 'Input';
        chatInput.parentElement.style.height = "35px";  // FIXME move this to CSS
        chatInput.parentElement.parentElement.style.borderRadius = "10px" // FIXME move this to CSS

        if (ENABLE_R1_ON_EVERY_PAGE_LOAD_OR_RELOAD) {
            const deepThinkButton = document.querySelector("div.ec4f5d61 > div:first-child");
            if (deepThinkButton.getAttribute("style").includes("--ds-button-color: transparent;")) {
                deepThinkButton.click();
            }
        }
    }

    /// should be applied after deleteOpenedSidebarElements since the selectors are based on its post-deletion DOM state
    // FIXME move this to CSS
    const applyClosedSidebarButtonsMargin = () => {
        let [sidebarButton, newChatButton] = [
            document.querySelector("#root > div > div.c3ecdb44 > div.dc04ec1d.a02af2e6 > div.a7f3a288.f0d4f23d > div:first-child"),
            document.querySelector("#root > div > div.c3ecdb44 > div.dc04ec1d.a02af2e6 > div.a7f3a288.f0d4f23d > div:nth-child(2)"),
        ];
        if (sidebarButton !== null) {
            sidebarButton.style.marginTop = "10px";
        }
        if (newChatButton !== null) {
            // So the hover tooltip doesn't annoyingly obstruct usage.
            newChatButton.style.marginTop = "60px";
        }
    }


    const applyOpenedSidebarHomeButton = () => {
        const bottomFlexboxAndProfileButtonSel = "#root > div > div.c3ecdb44 > div.dc04ec1d > div.b8812f16.a2f3d50e > div.c7f51894 > div";
        const profileEl = document.querySelector(bottomFlexboxAndProfileButtonSel);

        if (profileEl === null) { return; }

        profileEl.style.width = "fit-content"; // FIXME move this to CSS if possible

        const parentEl = profileEl.parentElement;
        parentEl.style.justifyContent = "space-between"; // FIXME move this to CSS if possible
        parentEl.style.flexDirection = "row"; // FIXME move this to CSS if possible

        const homeButton = profileEl.cloneNode(true);
        homeButton.firstChild.firstChild.innerHTML = homeSvgButton;
        homeButton.onclick = () => window.location.href = "https://chat.deepseek.com/";

        parentEl.appendChild(homeButton);
    }

    /// Also edits the profile button to have a hover effect similar to its opened sidebar version, as it currently doens't have one.
    /// The home button inherits this hover behavior.
    const applyClosedSidebarHomeButton = () => {
        const bottomProfileButtonSel = "#root > div > div.c3ecdb44 > div.dc04ec1d.a02af2e6 > div.a7f3a288.f0d4f23d > div.ede5bc47";
        const profileEl = document.querySelector(bottomProfileButtonSel);

        if (profileEl === null) { return; }

        const homeButton = profileEl.cloneNode(true);
        homeButton.firstChild.innerHTML = homeSvgButton;
        homeButton.onclick = () => window.location.href = "https://chat.deepseek.com/";

        const parentFlexboxContainer = profileEl.parentElement;
        profileEl.remove();

        const hoverWrapperProfile = document.createElement("div");
        hoverWrapperProfile.className = "boost-hover-wrapper";
        hoverWrapperProfile.appendChild(profileEl);

        const hoverWrapperHome = hoverWrapperProfile.cloneNode(false);
        hoverWrapperHome.appendChild(homeButton);
    
        parentFlexboxContainer.appendChild(hoverWrapperHome);
        parentFlexboxContainer.appendChild(hoverWrapperProfile);
    }


    const deleteOpenedSidebarElements = () => {
        document.querySelectorAll(openedSidebarHideSelectors)
            .forEach(el => el.remove());
    }

    const deleteClosedSidebarElements = () => {
        document.querySelectorAll(closedSidebarHideSelectors)
            .forEach(el => el.remove());
    }

    const deleteOtherElements = () => {
        document.querySelectorAll(otherHideSelectors)
            .forEach(el => el.remove());
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.matches(handleOpenedSidebarSel)) {
                            deleteOpenedSidebarElements(); // site always deletes and renews each sidebar state in DOM
                            applyOpenedNewChatWidthStyle();
                            applyOpenedSidebarHomeButton();
                        } else if (addedNode.matches(handleClosedSidebarSel)) {
                            deleteClosedSidebarElements(); // site always deletes and renews each sidebar state in DOM
                            applyClosedSidebarButtonsMargin();
                            applyClosedSidebarHomeButton();
                        }
                    }
                }
            }
        }
    });
    
    // Observe changes to both open and closed sidebars 
    // (selecting for "div.dc04ec1d" enables observing both as the closed sidebar actually changes the div's
    // class list to "dc04ec1d a02af2e6" aka the "div.dc04ec1d.a02af2e6" which we use to select for closed,
    // and therefore "div.dc04ec1d:not(.a02af2e6)" for opened).
    observer.observe(document.querySelector("#root > div > div.c3ecdb44 > div.dc04ec1d"), {
        childList: true,
        subtree: true
    });
    
    applyChatInputStylesAndState();

    deleteOtherElements();

    // Try applying for both opened and closed unconditionally for init, as we dont know the init state of the sidebar
    deleteOpenedSidebarElements();
    deleteClosedSidebarElements();

    applyClosedSidebarButtonsMargin();
    applyClosedSidebarHomeButton();

    applyOpenedNewChatWidthStyle();
    applyOpenedSidebarHomeButton();
}

const initCustomKeystrokeListeners = () => {
    /// cmd+shift+s or ctrl+shift+s
    const toggleSidebar = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s") {
            e.preventDefault();
            const closedSidebarButton = document.querySelector("div.dc04ec1d.a02af2e6 > div.a7f3a288.f0d4f23d > div:nth-child(1) > div"); 
            closedSidebarButton?.click();
            const openedSidebarButton = document.querySelector("div.dc04ec1d:not(.a02af2e6) > div.b8812f16.a2f3d50e > div.ec92d1d3 > div.ds-icon-button.d1f5e283");
            openedSidebarButton?.click();
        }
    }
    document.addEventListener('keydown', toggleSidebar);
}