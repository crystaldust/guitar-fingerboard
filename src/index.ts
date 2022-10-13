import {Application, Graphics, InteractionEvent, Text, TextStyle} from 'pixi.js'

const app = new Application({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: 1920,
    height: 1080
});

class NoteGraphics extends Graphics {
    note: string;
    noteText: Text;
    noteTextStyle: TextStyle = new TextStyle({
        align: "center",
        fill: "#eeeeee",
        fontSize: 17
    })

    constructor(noteString: string) {
        super();
        this.note = noteString
        this.noteText = new Text(this.note, this.noteTextStyle); // Text supports unicode!
        this.noteText.anchor.set(0.5)
        this.addChild(this.noteText)

        this.beginFill(noteString.indexOf('#') == -1 ? NATURAL_NOTE_COLOR : NONE_NATURAL_NOTE_COLOR)
        this.drawCircle(0, 0, 12)
        this.endFill()
    }
}


const GUITAR_BAR_WIDTH = 1500
const GUITAR_BAR_HEIGHT = 150

const guitarBar: Graphics = new Graphics()
guitarBar.beginFill(0xeeeeee)
guitarBar.drawPolygon(
    [
        {x: 0, y: 0},
        {x: GUITAR_BAR_WIDTH, y: 0},
        {x: GUITAR_BAR_WIDTH, y: GUITAR_BAR_HEIGHT},
        {x: 0, y: GUITAR_BAR_HEIGHT},
    ]
)
let SCREEN_WIDTH = app.screen.width;
let SCREEN_HEIGHT = app.screen.height;
guitarBar.x = (SCREEN_WIDTH - guitarBar.width) / 2
guitarBar.y = (SCREEN_HEIGHT - guitarBar.height) / 5

// Draw 6 strings
const EDGE_GAP = 0.05
const STRING_GAP = GUITAR_BAR_HEIGHT * (1 - EDGE_GAP * 2) / 5
for (let i = 0; i < 6; i++) {
    guitarBar.lineStyle(1 + 0.3 * i, 0x000000)
    let targetY = GUITAR_BAR_HEIGHT * EDGE_GAP + STRING_GAP * i

    guitarBar.moveTo(0, targetY)
    guitarBar.lineTo(GUITAR_BAR_WIDTH, targetY)
}

// Draw 12 fretboards
const FRATBOARD_GAP = GUITAR_BAR_WIDTH * 0.99 / 12  // 12 spaces, 13 fretboards (including 0 as open string)
guitarBar.lineStyle(3, 0x777777, 0.9)
app.stage.addChild(guitarBar)

const fretNoTextStyle: TextStyle = new TextStyle({
    align: "center",
    fill: "#333333",
    fontWeight: "bold",
    fontSize: 32
});

for (let i = 0; i < 13; i++) {
    guitarBar.moveTo(FRATBOARD_GAP * i, 0)
    guitarBar.lineTo(FRATBOARD_GAP * i, GUITAR_BAR_HEIGHT)

    let fretboardNumber: Text = new Text(i, fretNoTextStyle); // Text supports unicode!
    fretboardNumber.x = guitarBar.x + FRATBOARD_GAP * i
    fretboardNumber.y = guitarBar.y + GUITAR_BAR_HEIGHT + 10
    fretboardNumber.anchor.set(0.5, 0)
    app.stage.addChild(fretboardNumber)
}


const NATURAL_NOTE_COLOR = 0x222222
const NONE_NATURAL_NOTE_COLOR = 0x777777

const NOTE_RANGE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const START_NOTE_INDICES = [4, 11, 7, 2, 9, 4]
// const IS_NATURAL_NOTE = [true, false, true, false, true, true, false, true, false, true, false, true]
let NOTES = []
for (let i = 0; i < 13; i++) {
    let notesOnFret = []
    for (let j = 0; j < 6; j++) {
        let startNoteIndex = START_NOTE_INDICES[j]
        let noteIndex = (startNoteIndex + i) % 12
        let note = NOTE_RANGE[noteIndex]
        notesOnFret.push(note)
    }
    NOTES.push(notesOnFret)
}


for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 6; j++) {
        let startNoteIndex = START_NOTE_INDICES[j]
        let noteIndex = (startNoteIndex + i) % 12
        let note = NOTE_RANGE[noteIndex]

        let noteGraphics: NoteGraphics = new NoteGraphics(note)

        noteGraphics.interactive = true
        noteGraphics.on('pointertap', onNoteClick)


        noteGraphics.x = guitarBar.x + FRATBOARD_GAP * i - 15

        noteGraphics.y = guitarBar.y + GUITAR_BAR_HEIGHT * EDGE_GAP + STRING_GAP * j
        app.stage.addChild(noteGraphics)
    }
}

function onNoteClick(e: InteractionEvent): void {
    console.log((e.target as NoteGraphics).note)
}

// Try to find a tri-chord
// for (let i = 0; i < 12; i++) {
//     // console.log(NOTES[5][i])
//     if (NOTES[i][5] == 'C') {
//         console.log(i)
//     }
// }