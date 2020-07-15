/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle` 
    *, ::before, ::after {
        box-sizing: border-box;
        background-repeat: no-repeat;
        /* outline: 1px solid red; */
    }
    ::-webkit-scrollbar {
        display: none;
    }
    ::before,
    ::after {
        text-decoration: inherit;
        vertical-align: inherit;
    }
    html,
    body {
        line-height: 1.5;
        word-break: break-all;
        list-style: none;
        margin: 0;
        padding: 0;
        font-family:
            system-ui,
            /* macOS 10.11-10.12 */ -apple-system,
            /* Windows 6+ */ Segoe UI,
            /* Android 4+ */ Roboto,
            /* Ubuntu 10.10+ */ Ubuntu,
            /* Gnome 3+ */ Cantarell,
            /* KDE Plasma 5+ */ Noto Sans,
            /* fallback */ sans-serif,
            /* macOS emoji */ "Apple Color Emoji",
            /* Windows emoji */ "Segoe UI Emoji",
            /* Windows emoji */ "Segoe UI Symbol",
            /* Linux emoji */ "Noto Color Emoji";
        font-size: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        scrollbar-width: none;
    } 
    body {
        position: relative;
    }
    svg:not([fill]) {
        fill: currentColor;
    }
    textarea {
        resize: vertical;
    }
    a, area, button, input, label, select, summary, textarea, [tabindex] {
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        text-decoration: none;
    }
    button, input, select, textarea {
        background-color: transparent;
        border: 1px solid WindowFrame;
        color: inherit;
        font: inherit;
        letter-spacing: inherit;
        padding: 0.25em 0.375em;
        outline: none;
    }
    select {
        -moz-appearance: none;
        -webkit-appearance: none;
        background: no-repeat right center / 1em;
        border-radius: 0;
        padding-right: 1em;
    }
    select:not([multiple]):not([size]) {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='4'%3E%3Cpath d='M4 0h6L7 4'/%3E%3C/svg%3E");
    }
    ::-ms-expand {
        display: none;
    }
    [aria-busy="true"] {
        cursor: progress;
    }
    [aria-controls] {
        cursor: pointer;
    }
    [aria-disabled="true"], [disabled] {
        cursor: default;
    }
    [aria-hidden="false"][hidden] {
        display: initial;
    }
    [aria-hidden="false"][hidden]:not(:focus) {
        clip: rect(0, 0, 0, 0);
        position: absolute;
    }
    blockquote, q { 
        quotes: none;
    }
    blockquote:before, blockquote:after,q:before, q:after {
        content: '';  
        content: none;
    }
    ol, ul {  
        list-style: none;
    }
    code, kbd, pre, samp {
        font-family:
            /* macOS 10.10+ */ Menlo,
            /* Windows 6+ */ Consolas,
            /* Android 4+ */ Roboto Mono,
            /* Ubuntu 10.10+ */ Ubuntu Monospace,
            /* KDE Plasma 5+ */ Noto Mono,
            /* KDE Plasma 4+ */ Oxygen Mono,
            /* Linux/OpenOffice fallback */ Liberation Mono,
            /* fallback */ monospace;
    }
`;
