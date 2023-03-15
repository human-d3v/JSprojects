const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const circle = document.querySelector('circle');

const perimeter = circle.getAttribute('r') * 2 * Math.PI;
circle.setAttribute('stroke-dasharray', perimeter);
let currentOffset = 0;
let offsetVal = perimeter/durationInput.value;
console.log(offsetVal);

const timer = new Timer(durationInput,startButton,pauseButton, {
    onStart() {
        console.log('Timer Started');
    },
    onTick() {
        circle.setAttribute('stroke-dashoffset',(currentOffset))
        currentOffset -= (offsetVal) ;
    },
    onComplete(){
        console.log('Timer is complete');
    }
});

