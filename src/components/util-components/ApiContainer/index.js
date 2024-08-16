import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import syntaxTheme from './HLTheme';

const ApiContainer = (props) => {
    const { code } = props;
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        let isMounted = true;
        fetch(code)
            .then((res) => res.text())
            .then((md) => {
                if (isMounted) {
                    setMarkdown(md);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [code]);

    return (
        <div className="api-container">
            {markdown && (
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h2: (h) => {
                            return (
                                <div
                                    className={`api-title h${h.level} ${
                                        h.children[0].includes('title: ')
                                            ? ''
                                            : h.children[0]
                                                  .split('')
                                                  .join('')
                                                  .replace(/\s/g, '-')
                                                  .toLowerCase()
                                    }`}
                                >
                                    {h.children[0].includes('title: ')
                                        ? /title:(.+)/.exec(h.children[0])[1]
                                        : h.children}
                                </div>
                            );
                        },
                        pre: (pre) => {
                            const props = pre.children[0].props;
                            const match = /language-(\w+)/.exec(props.className || '') || [];
                            let language = '';

                            if (match.length > 0) {
                                language = match[1];
                            }

                            return (
                                <div className="api-code-highligher">
                                    <SyntaxHighlighter language={language} style={syntaxTheme}>
                                        {props.children}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        },
                    }}
                >
                    {markdown}
                </Markdown>
            )}
        </div>
    );
};

export default ApiContainer;
