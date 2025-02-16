/* */
function change(str) {
    function toSnake() {
        if (!/[-]|[A-Z]/g.test(str)) return str;
        return str.replace(
            /[-\s]|[A-Z]/g,
            (group) => group.toLowerCase().replace("-", "_").replace(" ", ""),
        );
    }

    function toCamel() {
        if (!/[-_\s]/g.test(str)) return str;

        return str
            .toLowerCase()
            .replace(
                /[-_\s][a-z]|[-_.\s]$/g,
                (group) =>
                    group.toUpperCase().replace("-", "").replace("_", "").replace(
                        " ",
                        "",
                    ),
            );
    }

    function toKebab() {
        if (!/[_]|[A-Z]/g.test(str)) return str;
        return str.replace(
            /[_\s]|[A-Z]/g,
            (group) => group.toLowerCase().replace("_", "-").replace(" ", ""),
        );
    }

    function toPascal() {
        if (!/^[a-z]|[-_][a-z]|[-]/g) return str;
        return str.replace(/^[a-z]|[-_\s][a-z]|[-_\s]$/g, (group) => {
            return group
                .toUpperCase()
                .replace("_", "")
                .replace("-", "")
                .replace(" ", "");
        });
    }

    function toConstant() {
        if (!/[-]|[.]|[a-z]/g) return str;
        return str.replace(/[-\s]|[a-z]/g, (group) => {
            return group.toUpperCase().replace("-", "_").replace(" ", "");
        });
    }

    function toDot() {
        return str.replace(/[_-\s]/g, (group) => {
            return group.replace("_", ".").replace("-", ".").replace(" ", ".");
        });
    }

    return {
        toSnake,
        toCamel,
        toKebab,
        toPascal,
        toConstant,
        toDot,
    };
}

// console.log(change('snaKe Case-').toCamel())
// console.log(change('sNaKe_ Case-').to_snake())
// console.log(change('sNake- case_').toKebab())
// console.log(change('snake-case_').toPascal())
console.log(change("snake- case-").toConstant());
// console.log(change('snake.case-').toDot())
