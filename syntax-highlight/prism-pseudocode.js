/**
 * Prism.js grammar for pseudocode.
 *
 * Keyword set derived from the Syncleus/language-pseudocode Atom grammar
 * (https://github.com/Syncleus/language-pseudocode), adapted for Prism.
 *
 * Supported file aliases: language-pseudocode, language-pseudo, language-pso
 */
(function (Prism) {

    Prism.languages.pseudocode = {

        // Comments: // line  and  /* block */
        'comment': [
            {
                pattern: /\/\*[\s\S]*?\*\//,
                greedy: true
            },
            {
                pattern: /\/\/.*/,
                greedy: true
            }
        ],

        // Double-quoted strings
        'string': {
            pattern: /"(?:\\.|[^"\\])*"/,
            greedy: true
        },

        // Pre/post-condition annotations (REQUIRE / ENSURE)
        'annotation': {
            pattern: /\b(?:REQUIRE|ENSURE)\b/,
            alias: 'tag'
        },

        // OOP keywords
        'class-keyword': {
            pattern: /\b(?:(?:END\s+)?CLASS|EXTENDS|ABSTRACT|THIS)\b/,
            alias: 'class-name'
        },

        // Function / procedure declaration and call
        'function-keyword': {
            pattern: /\b(?:(?:END\s+)?(?:FUNCTION|PROCEDURE)|RETURN)\b/,
            alias: 'function'
        },

        // I/O built-ins
        'builtin': /\b(?:INPUT|OUTPUT|PRINT|READ|WRITE)\b/,

        // Control-flow keywords
        'keyword': /\b(?:(?:END\s+)?(?:FOR(?:\s+ALL)?|WHILE|IF)|ELSE|THEN|DO|REPEAT|UNTIL|IN|TO|DOWNTO|STEP)\b/,

        // Boolean / null literals and logical operators
        'boolean': /\b(?:TRUE|FALSE|NIL|NULL|NONE)\b/,

        // Logical word operators
        'operator-word': {
            pattern: /\b(?:AND|OR|NOT|XOR)\b/,
            alias: 'operator'
        },

        // Numbers
        'number': /\b\d+(?:\.\d+)?\b/,

        // Symbolic operators: assignment arrows, comparison, arithmetic
        'operator': /←|->|≤|≥|≠|:=|<=|>=|<>|!=|==|[+\-*\/^%=<>|&]/,

        // Punctuation
        'punctuation': /[{}[\]();:,]/
    };

    // Register short aliases
    Prism.languages.pseudo = Prism.languages.pseudocode;
    Prism.languages.pso    = Prism.languages.pseudocode;

}(Prism));
