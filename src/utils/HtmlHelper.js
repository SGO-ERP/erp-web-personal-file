/* eslint-disable quotes */
import { DEFAULT_TEMPLATE } from '../constants/DocumentTemplate';

export default class HtmlHelper {
    static correctHtml(html, shouldAddTemplate = false) {
        // const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        let htmlElem = document.createElement('html');
        let styleElem = `<head><meta charset='utf-8'><style>
            .left, .ql-align-left {
            text-align: left !important;
            }
            .justify, .ql-align-justify {
            text-align: justify !important;
            }
            .right, .ql-align-right {
            text-align: right !important;
            }
            .center, .ql-align-center {
            text-align: center !important;
            }
            .default-pre-title {
                font-size: 3.9px;
                background-color: rgb(17, 85, 204);
                color: rgb(255, 255, 255);
            }
            * {
            font-family: 'Times New Roman';
            }
        </style></head>`;
        htmlElem.innerHTML = styleElem;
        let bodyElem = document.createElement('body');
        bodyElem.innerHTML = (shouldAddTemplate ? DEFAULT_TEMPLATE : '') + html.trim();
        bodyElem.querySelectorAll("[style*='text-align:left']").forEach((e) => {
            e.classList.add('left');
        });
        bodyElem.querySelectorAll("[style*='text-align:right']").forEach((e) => {
            e.classList.add('right');
        });
        bodyElem.querySelectorAll("[style*='text-align:center']").forEach((e) => {
            e.classList.add('center');
        });
        bodyElem.querySelectorAll("[style*='text-align:justify']").forEach((e) => {
            e.classList.add('justify');
        });
        htmlElem.appendChild(bodyElem);

        return '<html>' + htmlElem.innerHTML + '</html>';
    }

    static htmlForEditor(correctHtml) {
        let bodyElem = document.createElement('html');
        bodyElem.innerHTML = correctHtml.trim();
        return bodyElem
            .getElementsByTagName('body')[0]
            .innerHTML.replaceAll('<ins', '<u')
            .replaceAll('ins>', 'u>');
    }
}
