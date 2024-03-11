import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { EditorView, keymap } from '@codemirror/view';
import { defaultTabBinding } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';

export default function setupEditors(){
    // Editor parent elements
    const jsonReqBody = document.querySelector('data-json-request-body');
    const jsonResBody = document.querySelector('data-json-response-body');

    // Basic editor extensions
    const basicExtensions = [
        basicSetup,
        keymap.of([defaultTabBinding]),
        json(),
        EditorState.tabSize(2),
    ]
    
    // Request editor initialization
    const reqEditor = new EditorView({
        state: EditorState.create({
            doc: "{\n\t\n}",
            extensions: basicExtensions,
        }),
        parent: jsonReqBody,
    });
    
    // Response editor initialization
    const resEditor = new EditorView({
        state: EditorState.create({
            doc: "{}",
            extensions: [
                ...basicExtensions, 
                // Make this editor read only
                EditorView.editable.of(false)],
        }),
        parent: jsonResBody,
    });

    function updateResEditor (value) {
        // On update change all data (line 0 - final line) to passed data
        resEditor.dispatch({
            changes: {
                from: 0,
                to: resEditor.state.doc.length,
                insert: JSON.stringify(value, null, 2)
            }
        })
    }

    return {reqEditor, updateResEditor};
}