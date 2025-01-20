import {getBaseUrl} from "@common/api/apiClient.ts";

function getProxiedImageSrc(src: string, cik: string, accessionNumber: string): string {

    const baseUrl = getBaseUrl();

    const cleanedAccessionNumber = accessionNumber.replace(/-/g, '');

    return baseUrl + `proxy/filing/edgar/data/${cik}/${cleanedAccessionNumber}/` + src;
}

function getXPathForNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentNode;
        if (!parent) return '';

        // Get the index of this text node among its siblings
        let textNodeIndex = 1;
        let sibling = node.previousSibling;
        while (sibling) {
            if (sibling.nodeType === Node.TEXT_NODE) {
                textNodeIndex++;
            }
            sibling = sibling.previousSibling;
        }

        return `${getXPathForNode(parent)}/text()[${textNodeIndex}]`;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        let index = 1;
        let sibling = element.previousElementSibling;

        while (sibling) {
            if (sibling.tagName === element.tagName) {
                index++;
            }
            sibling = sibling.previousElementSibling;
        }

        const tagName = element.tagName.toLowerCase();
        return `${node.parentNode && node.parentNode.nodeType === Node.ELEMENT_NODE
            ? getXPathForNode(node.parentNode)
            : ''}/${tagName}[${index}]`;
    }

    return '';
}

function getNodeFromXPath(xpath: string, doc: Document): Node | null {
    try {
        const result = doc.evaluate(
            xpath,
            doc,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        return result.singleNodeValue;
    } catch (e) {
        console.error('Error finding node from XPath:', e);
        return null;
    }
}

// For table selections
function getTableCellXPath(table: HTMLTableElement, row: number, col: number): string {
    return `${getXPathForNode(table)}/tr[${row + 1}]/td[${col + 1}]`;
}

export { getXPathForNode, getNodeFromXPath, getTableCellXPath, getProxiedImageSrc };