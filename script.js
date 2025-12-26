let array = [];
let colors = ["#A2BA1F", "#ED9609", "#46ED09", "#0EF3FB", "#0E1FFB", "#B30304"];
let speed = 300;
let styleMode = "box"; // 'box' or 'bar'

document.getElementById("speed").addEventListener("input", e => speed = e.target.value);

function setArrayFromInput() {
    let input = document.getElementById("numberInput").value;
    array = input.split(/[\s,]+/).map(num => parseInt(num)).filter(num => !isNaN(num));
    renderArray();
}

function toggleStyle() {
    styleMode = (styleMode === "box") ? "bar" : "box";
    renderArray();
}

function renderArray(highlights = []) {
    const container = document.getElementById("array-container");
    container.innerHTML = "";

    const maxVal = Math.max(...array); // 🔥 Get largest number

    array.forEach((num, i) => {
        const element = document.createElement("div");

        if (styleMode === "box") {
            element.classList.add("box");
            element.style.background = highlights.includes(i)
                ? "red"
                : colors[i % colors.length];
            element.textContent = num;

        } else {
            element.classList.add("bar");

            const scaledHeight = (num / maxVal) * 100;
            element.style.height = `${scaledHeight}%`;

            element.style.background = highlights.includes(i)
                ? "red"
                : "linear-gradient(white,skyblue,blue)";
        }

        container.appendChild(element);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//sound
let audioCtx = null;

function playSound(value) {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Convert number to safe frequency
    let freq = 150 + (value * 20);
    if (freq < 150) freq = 150;

    osc.frequency.value = freq;
    osc.type = "sine";

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}


// Sorting algorithms
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            renderArray([j, j+1]);
             playSound(array[j]);   // 🔊 SOUND HERE
            await delay(speed);
            if (array[j] > array[j+1]) {
                [array[j], array[j+1]] = [array[j+1], array[j]];
            }
        }
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i+1; j < array.length; j++) {
            renderArray([minIndex, j]);
            playSound(array[j]);
            await delay(speed);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
}

async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            renderArray([j, j+1]);
            await delay(speed);
            playSound(array[j]);
            array[j+1] = array[j];
            j--;
        }
        array[j+1] = key;
    }
}

async function mergeSortHelper(l, r) {
    if (l >= r) return;
    let mid = Math.floor((l + r) / 2);
    await mergeSortHelper(l, mid);
    await mergeSortHelper(mid+1, r);
    let temp = [];
    let i = l, j = mid+1;
    while (i <= mid && j <= r) {
        renderArray([i, j]);
        playSound(array[i]);
        await delay(speed);
        if (array[i] <= array[j]) temp.push(array[i++]);
        else temp.push(array[j++]);
    }
    while (i <= mid) temp.push(array[i++]);
    while (j <= r) temp.push(array[j++]);
    for (let k = l; k <= r; k++) array[k] = temp[k - l];
}

async function quickSortHelper(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        renderArray([j, high]);
        playSound(array[j]);
        await delay(speed);
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    [array[i+1], array[high]] = [array[high], array[i+1]];
    return i + 1;
}

async function timSort() {
    array.sort((a, b) => a - b);
    renderArray();
    playSound(array[j]);
    await delay(speed);
}

async function startSort(algo) {
    if (algo === "bubble") await bubbleSort();
    if (algo === "selection") await selectionSort();
    if (algo === "insertion") await insertionSort();
    if (algo === "merge") await mergeSortHelper(0, array.length-1);
    if (algo === "quick") await quickSortHelper(0, array.length-1);
    if (algo === "tim") await timSort();
    renderArray();
}
