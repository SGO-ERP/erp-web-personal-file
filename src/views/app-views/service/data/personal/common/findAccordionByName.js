const hasAccordionByName = (allOpen, accordions, name, key) => {
    if (allOpen) return key;
    if (!accordions || accordions.length === 0) return [];
    if (accordions.some((accordion) => accordion.accordion.name === name)) return key;
    return [];
};

export default hasAccordionByName;
