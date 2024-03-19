const TAGS = [
    "Motion",
    "Quadratic Equations",
    "Chemical Bonding",
    "Electrostatics",
    "Trigonometry",
    "Thermodynamics",
    "Kinematics",
    "Coordinate Geometry",
    "Organic Chemistry",
    "Magnetism",
    "Calculus",
    "Inorganic Chemistry",
    "Waves",
    "Probability",
    "Solutions",
    "Optics",
    "Vectors",
    "Electrochemistry",
    "Modern Physics",
    "Matrices and Determinants",
    "Coordination Compounds",
    "Fluid Mechanics",
    "Sequences and Series",
    "Chemical Kinetics",
    "Thermodynamics",
    "Differential Equations",
    "Surface Chemistry",
    "SHM and Waves",
    "3D Geometry",
    "P-Block Elements",
    "Gravitation",
    "Complex Numbers",
    "D-Block Elements",
    "Work, Energy, Power",
    "Binomial Theorem",
    "Biomolecules",
    "Rotational Motion",
    "Sets, Relations, Functions",
    "Nuclear Chemistry",
    "Semiconductor Devices",
    "Limits, Continuity, Differentiability",
    "Polymers",
    "Ray Optics",
    "Statistics",
    "Aldehydes, Ketones, Carboxylic Acids",
    "Capacitors",
    "Mathematical Induction",
    "Alcohols, Phenols, Ethers",
    "Current Electricity",
    "Permutations and Combinations",
    "Gaseous State"
];

const DURATION = 110000;
const ROWS = (window.innerWidth<=1000)?14:6;
const TAGS_PER_ROW = 50;

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(arr) {
    return [...arr].sort(() => .5 - Math.random());
}

function createTagElement(text) {
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.innerHTML = `<span>#</span> ${text}`;
    return tagElement;
}

function createInfiniteLoopSlider(reverse) {
    const sliderElement = document.createElement('div');
    sliderElement.className = 'loop-slider';
    sliderElement.style.setProperty('--duration', `${random(DURATION - 20000, DURATION + 20000)}ms`);
    sliderElement.style.setProperty('--direction', reverse ? 'reverse' : 'normal');

    const innerElement = document.createElement('div');
    innerElement.className = 'inner';

    sliderElement.appendChild(innerElement);
    return sliderElement;
}

function renderTags() {
    const tagListElement = document.getElementById('tag-list');

    for (let i = 0; i < ROWS; i++) {
        const reverse = i % 2 === 1;
        const sliderElement = createInfiniteLoopSlider(reverse);

        shuffle(TAGS).slice(0, TAGS_PER_ROW).forEach(tag => {
            const tagElement = createTagElement(tag);
            sliderElement.querySelector('.inner').appendChild(tagElement);
        });

        tagListElement.appendChild(sliderElement);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTags();
});

