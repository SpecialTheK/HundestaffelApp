//NOTE (christian): vielleicht ist diese klasse etwas overkill?

export class Person {

    //NOTE (christian): formular optionen!
    hair: string[] = [
        "Kahl",
        "Kurz",
        "Mittellang",
        "Lang"
    ];
    hairColor: string[] = [
        "Braun",
        "Dunkelbraun",
        "Hellbraun",
        "Blond",
        "Dunkelblond",
        "Schwarz",
        "Rot",
        "Grau",
        "Weiß"
    ];
    body: string[] = [
        "Schlank",
        "Athletisch",
        "Normal",
        "Füllig",
        "Übergewichtig"
    ];


    name: string;
    age: number;
    glasses: boolean;
    hair_choice: string;
    hairColor_choice: string;
    body_choice: string;
    allergies: string;
    illness: string;
    medication: string;

    constructor(name: string = "", age: number = 0, glasses: boolean = false, hair_choice: string = "", hairColor_choice: string = "",
            body_choice: string = "", allergies: string = "Keine", illness: string = "Keine", medication: string = "Keine"){
        this.name = name;
        this.age = age;
        this.glasses = glasses;
        this.hair_choice = hair_choice;
        this.hairColor_choice = hairColor_choice;
        this.body_choice = body_choice;
        this.allergies= allergies;
        this.illness = illness;
        this.medication = medication;
    }

    convertToSimpleObject(){
        return {
            name: this.name,
            age: this.age,
            glasses: this.glasses,
            hair_choice: this.hair_choice,
            hairColor_choice: this.hairColor_choice,
            body_choice: this.body_choice,
            allergies: this.allergies,
            illness: this.illness,
            medication: this.medication
        };
    }

    static fromData(person: any){
        return new Person(person.name, person.age, person.glasses, person.hair_choice, person.hairColor_choice,
                person.body_choice, person.allergies, person.illness, person.medication);
    }

    static isPersonObject(person: any): boolean{
        let isPerson = true;

        if(!person.hasOwnProperty('name')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('age')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('glasses')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('hair_choice')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('hairColor_choice')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('body_choice')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('allergies')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('illness')){
            isPerson = false;
        }
        if(!person.hasOwnProperty('medication')){
            isPerson = false;
        }
        
        return isPerson;
    }

}
