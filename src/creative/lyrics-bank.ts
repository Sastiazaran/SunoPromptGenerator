/**
 * Hand-written lyric blocks, grouped by emotional family and language.
 *
 * The generator used to hold a single skeleton per language, so every song
 * shipped with a byte-identical chorus. Blocks here are whole coherent units
 * rather than lines assembled at random: variety comes from choosing between
 * written alternatives, which keeps the writing sane while making two runs of
 * the same brief genuinely different songs.
 *
 * ## Slot contract
 *
 * Slots are substituted verbatim, so every block must stay grammatical for any
 * value the slot can hold:
 *
 * - `{image}`  noun phrase or a bare time from `Setting.imagery` ("2:13 AM",
 *              "fluorescent hum"). Only ever placed at the head of a line.
 * - `{theme}`  from `JourneyStage.themes`, and unreliably a noun — the corpus
 *              contains "forgive" and "stay or go". Only ever placed on a line
 *              of its own, after a line that sets it up.
 * - `{place}`  lowercased setting label ("all-night diner").
 * - `{person}` noun phrase for the relationship at stake.
 * - `{dest}`   noun phrase for the emotional destination. Never a verb phrase —
 *              the UI placeholder and defaults enforce this.
 * - `{title}`  song title, outros only.
 * - `{seed}`   the user's raw fragment. Only ever quoted, never inflected.
 *
 * Blocks must honour the documented rules: night is never a threat, nostalgia
 * carries gratitude, the road mirrors the person, and no ending is sealed.
 */

import type { EmotionalFamily, Language } from './schema'

export interface FamilyBank {
  verses: string[]
  pres: string[]
  choruses: string[]
  bridges: string[]
  breakdowns: string[]
  outros: string[]
}

export type LyricBank = Record<Language, Record<EmotionalFamily, FamilyBank>>

/** Optional line woven in when the writer supplied a lyrical seed. */
export const SEED_LINES: Record<Language, string[]> = {
  en: [
    'You said "{seed}" like a map I still keep',
    'I keep hearing "{seed}" in the tyre noise',
    '"{seed}" — I never did put that down',
  ],
  es: [
    'Dijiste "{seed}" como un mapa que aún guardo',
    'Sigo escuchando "{seed}" en el ruido del asfalto',
    '"{seed}" — eso nunca lo solté',
  ],
}

const EN: Record<EmotionalFamily, FamilyBank> = {
  ignition: {
    verses: [
      `{image}, and the whole map is still blank
I've got half a tank and no good reason
Everything I own fits behind the seat
and the door I closed is still warm
I don't know the roads out here by name
I only know they go`,
      `First light on a windshield I just paid for
Hands at ten and two like it matters
My mother's voice in the mirror saying careful
{person} texting me to send a photo of the sky
Everything narrows to one idea:
{theme}`,
      `The {place} lets me sit here as long as I want
Nobody's waiting on me to be anyone yet
I count the exits like they're promises
Each one a version of me I could try
I'm not running from the house behind me
I'm running toward the fact that I can`,
    ],
    pres: [
      `And my hands are shaking but they're steady on the wheel
That's the first true thing I've felt`,
      `There's a hum under everything tonight
Like the world clearing its throat`,
    ],
    choruses: [
      `Let it be the first of everything
Let it be too soon, let it be too much
I would rather learn this at full speed
than wonder what the road was like
Nothing's promised and I'm going anyway
That's the closest thing to {dest} I know`,
      `Start the engine, don't rehearse it
Some things you only learn by leaving
I've been careful all my life
and careful never took me anywhere
Tonight the dark is on my side
and every mile is mine to name`,
      `I am eighteen kinds of unfinished
and the highway doesn't mind
It takes me as I am, half-written,
doing ninety toward {dest}
Say what you want about beginnings —
at least they're honest about not knowing`,
    ],
    bridges: [
      `Someday I'll tell this like a story
and leave out how scared I was
But right now it's just weather and asphalt
and a kid who finally moved`,
      `If I'm wrong about all of it
I'll still have been out here
Better a wrong road driven
than a right one only imagined`,
    ],
    breakdowns: [
      `No plan. No map. Just this.
Just the sound of going.`,
      `Windows down. Radio low.
Nobody's version of me but mine.`,
    ],
    outros: [
      `{title}, and the tank still reads half full
The house gets small behind me
I don't look as long as I used to
and the road keeps opening`,
      `Somewhere out past the last streetlight
the story hasn't decided yet
I like it better that way
Go on, {title}, go on`,
    ],
  },

  bond: {
    verses: [
      `{image}, and neither of us says a word
Three hundred miles and the quiet never got heavy
You sleep with your hand on the gearstick
I drive slower so it lasts
There's a language we made out of nothing
and nobody else can read it`,
      `We stopped at the {place} for coffee we didn't need
just to stand outside a while longer
You laughed at something I forgot immediately
and I kept the sound instead
{person}, if this is ordinary
then ordinary was underrated`,
      `Your feet on the dash, my hand out the window
The tape deck eating the same song again
You tell me the thing you never tell anyone
and I don't make it a big deal — that's the gift
It's not that we're going somewhere
It's that we're going`,
    ],
    pres: [
      `And the engine keeps the time for us
like it knows what it's carrying`,
      `Don't say it yet, don't name it yet
Let it be this for one more hour`,
    ],
    choruses: [
      `Stay in the passenger seat a while
Let the towns go by unvisited
I don't need the destination
if the drive keeps sounding like this
Whatever this is, I'm not naming it
I'm just keeping the tank full`,
      `You're the reason I take the long way
You're why I miss the exit on purpose
Somewhere between the state line and the morning
we turned into {dest}
I'll keep the radio down low
so I can hear you breathing over the road`,
      `Two people and a working engine —
that's a whole world if you let it be
No promises we can't keep at this speed
just the next hundred miles, agreed
Say yes to the drive, not the ending
and I'll say yes to all of it`,
    ],
    bridges: [
      `I know how this usually goes
People get tired, roads get long
But nobody's tired yet
and the sun isn't up yet either`,
      `If it ends, it ends somewhere ahead
Not here, not in this car
Right now there's coffee going cold
and your hand on the back of my neck`,
    ],
    breakdowns: [
      `Just the tyres. Just the breathing.
Nobody has to talk.`,
      `Mile marker. Mile marker. Mile marker.
Still here. Still here.`,
    ],
    outros: [
      `{title}, and you're still asleep
I take the curve gently so you stay that way
The dawn does what dawns do
and I let it`,
      `Keep going, keep going, don't wake up
{title} in the windshield glow
We'll figure out the rest at the next town
or the one after that`,
    ],
  },

  rupture: {
    verses: [
      `{image}, and I'm learning the shape of a room without you
The kettle still makes two cups out of habit
I drove out here to think and forgot to
Now I'm just a man in a parked car
The radio's off because every song
has an opinion about this`,
      `The {place} at this hour is honest company
Nobody asks anybody anything
I've got your number and the good sense not to use it
and neither of those is comfort
I'm not angry, that's the strange part
I'm just standing in the size of it`,
      `We didn't break, we came apart slowly
like a road turning into two roads
I keep going back over it for a villain
and I keep coming back with nobody
{person}, we were kind about it —
somehow that's the part that hurts`,
    ],
    pres: [
      `And it's not a wound, it's a weather
It moves through and I stay standing`,
      `I keep waiting for the part that breaks me
and it keeps not coming`,
    ],
    choruses: [
      `So I'll drive it out of my system
one honest mile at a time
I'm not asking the night to fix it
I'm just asking it to hold me while it's here
Nothing about this is finished
and nothing about this is the end
There's grief and there's still a horizon
and tonight I'm carrying both`,
      `Let it hurt in the right key
Let it be a song and not a wound
I loved somebody and it stopped working —
that's the whole of it, and it's enormous
Somewhere ahead there's {dest}
I can't see it, I just believe in the road`,
      `Everything I'd change I can't
Everything I keep, I choose
The good years don't get returned
because the last one went wrong
I'll take the ache with the gratitude
They came in the same box`,
    ],
    bridges: [
      `I thought the silence would be the enemy
Turns out it's just quiet
Turns out I can sit inside it
and come out the other side`,
      `You get to be a good memory
I'm not taking that from either of us
Put it in the glovebox, not the ditch
Some things you carry, not bury`,
    ],
    breakdowns: [
      `Engine off. Hands still on the wheel.
Nowhere to be. That's new.`,
      `Nobody's fault. Nobody's fault.
Say it until it's just true.`,
    ],
    outros: [
      `{title} in the rearview, getting smaller
I don't hate it, I don't hold it
The road does the only thing it knows
and I let it do that for me`,
      `Not fixed. Not finished. Still driving.
{title} and the tail lights ahead
Someone else is out here too
That helps more than it should`,
    ],
  },

  resolve: {
    verses: [
      `{image}, and I've made up my mind at last
Not loudly, not with a speech —
I just stopped arguing with myself
somewhere around the county line
It took me a long time to get simple
Simple was the hard part`,
      `I sat in the {place} until the coffee went cold
turning it over like a coin
Everybody had advice and none of it was mine
so I drove until the noise fell off
It came down to a single word
and the word was:
{theme}`,
      `{person} said I'd know when I knew
and I hated that, and they were right
There's no lightning, there's no sign —
just a morning where I stopped stalling
I put the key in and it started
That's the miracle, that it started`,
    ],
    pres: [
      `And my hands know before I do
They're already turning the wheel`,
      `No more circling the same block
Pick a lane, pick a life`,
    ],
    choruses: [
      `I'm choosing it, I'm choosing it
Not because I'm sure — because I'm done waiting
Courage isn't the absence of the shake
it's the hand that turns the key anyway
Whatever's out past the on-ramp
I'd rather meet it than imagine it`,
      `Give me the road and I'll take the risk
Give me the wrong turn, I'll take that too
I've been the passenger in my own life
and tonight I'm getting out to drive
Straight ahead into {dest}
No guarantee and no regret`,
      `Say it out loud so it's real:
I'm going, I'm going, I'm going
Not away from, not away from —
toward, for the first time, toward
The gas station light goes out behind me
and the dark ahead is mine to enter`,
    ],
    bridges: [
      `Every version of me that stayed
is standing in the mirror waving
I don't owe them an apology
I owe them the trip`,
      `If it's a mistake it's my mistake
and I'll drive it all the way to the end
That's not stubbornness, that's ownership
Finally, something is mine`,
    ],
    breakdowns: [
      `Key. Ignition. Breath.
That's the whole ceremony.`,
      `No countdown. No blessing.
Just go.`,
    ],
    outros: [
      `{title}, and the indicator's already on
I don't check the mirror twice
The road takes the decision from me
and turns it into distance`,
      `Nothing's promised out here, {title}
and I have never felt so light
The exit comes up quick
and I take it`,
    ],
  },

  homecoming: {
    verses: [
      `{image}, and the town put up a new sign
Everything is smaller and warmer than I left it
The {place} still has the same bad lighting
and I have never been so glad about lighting
I drove this road at seventeen convinced it led away
Turns out it just leads`,
      `Same curve where I learned what a car could do
Same field, same fence, different me
I keep expecting to feel like a stranger
and I keep just feeling like a person
{person} on the porch, waving before they see who it is —
that's a kind of wealth nobody counts`,
      `I brought back less than I took
and somehow the bags are heavier
Every mile out there was worth it
and every mile back is worth it too
Nothing's the same and nothing's ruined
Both of those are good news`,
    ],
    pres: [
      `And I'm not here to stay, I'm here to see
There's a difference and it took years`,
      `The old road knows my tyres
It doesn't ask where I've been`,
    ],
    choruses: [
      `Everything looks the same and nothing is
and I mean that kindly, I mean that as thanks
I got to be that person, on this road,
and now I get to be this one
Nostalgia isn't a place I'm moving back to
it's a light I drive by`,
      `Take me down the way I remember
Let it be smaller, let it be worn
I'm not here to fix the past —
I'm here to shake its hand
Whatever I was looking for out there
was partly {dest}, and partly this`,
      `So here's to the road that raised me
and the roads that took me off it
I'll be gone again by Tuesday
and I'll be grateful the whole drive
You can love a place and still leave it
That's not betrayal, that's just motion`,
    ],
    bridges: [
      `I used to think coming back meant failing
Now I think it's just the shape of a life —
out and back and out again
like breathing, like tide`,
      `The kid who left is still in the car
riding along, quiet, satisfied
I tell him it worked out
mostly, unevenly, enough`,
    ],
    breakdowns: [
      `Same porch light. Different eyes.
Still on.`,
      `Nothing waited for me.
Everything welcomed me. Both true.`,
    ],
    outros: [
      `{title}, and the porch light stays on behind me
I'll be back before it matters
The road takes me the way it always did
gently, and without asking`,
      `Go easy, {title}, go easy
The town gets small and stays warm
There's another road past the water tower
and I hear it calling already`,
    ],
  },
}

const ES: Record<EmotionalFamily, FamilyBank> = {
  ignition: {
    verses: [
      `{image}, y el mapa todavía está en blanco
Medio tanque y ninguna buena razón
Todo lo que tengo cabe detrás del asiento
y la puerta que cerré sigue tibia
No sé el nombre de estas carreteras
solo sé que van`,
      `Primera luz sobre un parabrisas recién pagado
Las manos en el volante como si eso importara
La voz de mi madre en el espejo diciendo cuidado
{person} pidiéndome una foto del cielo
Todo se reduce a una sola idea:
{theme}`,
      `El {place} me deja quedarme el tiempo que quiera
Nadie espera todavía que yo sea alguien
Cuento las salidas como si fueran promesas
cada una una versión de mí que podría probar
No huyo de la casa que dejé atrás
corro hacia el hecho de que puedo`,
    ],
    pres: [
      `Y me tiemblan las manos pero el volante va firme
Es la primera cosa cierta que siento`,
      `Hay un zumbido debajo de todo esta noche
como si el mundo se aclarara la garganta`,
    ],
    choruses: [
      `Que sea el primero de todo
Que sea demasiado pronto, que sea demasiado
Prefiero aprender esto a toda velocidad
que preguntarme cómo era el camino
Nada está prometido y voy igual
Es lo más parecido a {dest} que conozco`,
      `Enciende el motor, no lo ensayes
Hay cosas que solo se aprenden yéndose
Fui prudente toda mi vida
y la prudencia nunca me llevó a ninguna parte
Esta noche la oscuridad está de mi lado
y cada kilómetro es mío para nombrarlo`,
      `Soy dieciocho formas de estar sin terminar
y a la carretera no le molesta
Me toma como soy, a medio escribir,
a ciento cuarenta hacia {dest}
Digan lo que digan de los comienzos:
al menos son honestos sobre no saber`,
    ],
    bridges: [
      `Algún día contaré esto como una historia
y me saltaré la parte del miedo
Pero ahora es solo clima y asfalto
y alguien que por fin se movió`,
      `Si me equivoco en todo esto
igual habré estado aquí afuera
Mejor un camino equivocado y andado
que uno correcto solo imaginado`,
    ],
    breakdowns: [
      `Sin plan. Sin mapa. Solo esto.
Solo el sonido de irse.`,
      `Ventanas abajo. Radio baja.
Ninguna versión de mí salvo la mía.`,
    ],
    outros: [
      `{title}, y el tanque todavía marca la mitad
La casa se hace pequeña detrás
Ya no miro tanto tiempo como antes
y la carretera sigue abriéndose`,
      `En algún punto pasada la última farola
la historia todavía no decide
Me gusta más así
Sigue, {title}, sigue`,
    ],
  },

  bond: {
    verses: [
      `{image}, y ninguno de los dos dice nada
Trescientos kilómetros y el silencio nunca pesó
Duermes con la mano en la palanca
y manejo más lento para que dure
Hicimos un idioma con nada
y nadie más sabe leerlo`,
      `Paramos en el {place} por un café que no hacía falta
solo para quedarnos afuera un rato más
Te reíste de algo que olvidé enseguida
y me quedé con el sonido
{person}, si esto es lo común
entonces lo común estaba subestimado`,
      `Tus pies en el tablero, mi mano en la ventana
El casete comiéndose la misma canción
Me cuentas eso que no le cuentas a nadie
y no hago un drama — ese es el regalo
No es que vayamos a algún sitio
Es que vamos`,
    ],
    pres: [
      `Y el motor nos lleva el compás
como si supiera lo que carga`,
      `No lo digas todavía, no lo nombres
Deja que sea esto una hora más`,
    ],
    choruses: [
      `Quédate un rato en el asiento de al lado
Que los pueblos pasen sin visitarlos
No necesito el destino
si el viaje sigue sonando así
Sea lo que sea, no le pongo nombre
solo mantengo el tanque lleno`,
      `Eres la razón por la que doy la vuelta larga
por la que me paso la salida a propósito
En algún punto entre la frontera y la mañana
nos convertimos en {dest}
Voy a dejar la radio bajita
para oírte respirar sobre el asfalto`,
      `Dos personas y un motor que anda:
eso es un mundo entero si lo dejas
Sin promesas que no aguanten esta velocidad
solo los próximos cien kilómetros, de acuerdo
Di que sí al viaje, no al final
y yo digo que sí a todo`,
    ],
    bridges: [
      `Ya sé cómo suele terminar esto
La gente se cansa, los caminos se alargan
Pero nadie está cansado todavía
y el sol tampoco ha salido`,
      `Si se acaba, se acaba más adelante
No aquí, no en este coche
Ahora hay un café enfriándose
y tu mano en mi nuca`,
    ],
    breakdowns: [
      `Solo las ruedas. Solo la respiración.
Nadie tiene que hablar.`,
      `Kilómetro. Kilómetro. Kilómetro.
Seguimos aquí. Seguimos.`,
    ],
    outros: [
      `{title}, y tú sigues dormida
Tomo la curva despacio para que sigas así
El amanecer hace lo que hacen los amaneceres
y yo lo dejo`,
      `Sigue, sigue, no despiertes
{title} en el resplandor del parabrisas
Lo demás lo resolvemos en el próximo pueblo
o en el siguiente`,
    ],
  },

  rupture: {
    verses: [
      `{image}, y aprendo la forma de un cuarto sin ti
La cafetera todavía hace dos tazas por costumbre
Vine hasta aquí a pensar y se me olvidó
Ahora soy solo alguien en un coche parado
La radio apagada porque cada canción
tiene una opinión sobre esto`,
      `El {place} a esta hora es compañía honesta
Nadie le pregunta nada a nadie
Tengo tu número y el buen juicio de no usarlo
y ninguna de las dos cosas consuela
No estoy enojado, eso es lo raro
Solo estoy de pie dentro del tamaño de esto`,
      `No nos rompimos, nos fuimos separando despacio
como una carretera que se vuelve dos
Repaso todo buscando un culpable
y siempre vuelvo con nadie
{person}, fuimos amables al final —
y de algún modo esa es la parte que duele`,
    ],
    pres: [
      `Y no es una herida, es un clima
Pasa por encima y yo sigo de pie`,
      `Espero la parte que me rompe
y esa parte no llega`,
    ],
    choruses: [
      `Así que lo voy a manejar hasta sacármelo
un kilómetro honesto a la vez
No le pido a la noche que lo arregle
solo que me sostenga mientras está
Nada de esto está terminado
y nada de esto es el final
Hay duelo y todavía hay horizonte
y esta noche llevo los dos`,
      `Que duela en el tono correcto
Que sea canción y no herida
Quise a alguien y dejó de funcionar:
eso es todo, y es enorme
En algún punto adelante está {dest}
No lo veo, solo creo en la carretera`,
      `Todo lo que cambiaría no puedo
Todo lo que guardo, lo elijo
Los años buenos no se devuelven
porque el último salió mal
Me llevo el dolor con la gratitud
Vinieron en la misma caja`,
    ],
    bridges: [
      `Pensé que el silencio sería el enemigo
Resulta que es solo silencio
Resulta que puedo sentarme adentro
y salir del otro lado`,
      `Te toca ser un buen recuerdo
No se lo quito a ninguno de los dos
Guárdalo en la guantera, no en la cuneta
Hay cosas que se cargan, no se entierran`,
    ],
    breakdowns: [
      `Motor apagado. Las manos en el volante.
Ningún sitio al que llegar. Eso es nuevo.`,
      `Culpa de nadie. Culpa de nadie.
Repetirlo hasta que sea simplemente cierto.`,
    ],
    outros: [
      `{title} en el retrovisor, cada vez más chico
No lo odio, no lo retengo
La carretera hace lo único que sabe
y la dejo hacerlo por mí`,
      `Ni arreglado, ni terminado. Todavía manejando.
{title} y las luces rojas adelante
Hay alguien más aquí afuera
Eso ayuda más de lo que debería`,
    ],
  },

  resolve: {
    verses: [
      `{image}, y por fin me decidí
Sin ruido, sin discursos —
simplemente dejé de discutir conmigo
en algún punto pasada la salida del pueblo
Me costó mucho tiempo volverme simple
Lo simple era la parte difícil`,
      `Me quedé en el {place} hasta que el café se enfrió
dándole vueltas como a una moneda
Todos tenían consejos y ninguno era mío
así que manejé hasta que el ruido se cayó
Todo se redujo a una palabra
y la palabra era:
{theme}`,
      `{person} me dijo que lo sabría cuando lo supiera
y lo odié, y tenía razón
No hay relámpago, no hay señal —
solo una mañana en la que dejé de posponer
Metí la llave y arrancó
Ese es el milagro, que arrancó`,
    ],
    pres: [
      `Y mis manos lo saben antes que yo
Ya están girando el volante`,
      `No más vueltas a la misma manzana
Elige un carril, elige una vida`,
    ],
    choruses: [
      `Lo elijo, lo elijo
No porque esté seguro: porque terminé de esperar
El valor no es que no tiemble la mano
es la mano que igual gira la llave
Lo que sea que haya pasando la rampa
prefiero encontrarlo que imaginarlo`,
      `Dame la carretera y me quedo el riesgo
Dame el giro equivocado, también me lo quedo
Fui de copiloto en mi propia vida
y esta noche me bajo a manejar
Derecho hacia {dest}
Sin garantía y sin arrepentirme`,
      `Dilo en voz alta para que sea real:
me voy, me voy, me voy
No lejos de, no lejos de —
hacia, por primera vez, hacia
La luz de la gasolinera se apaga detrás
y la oscuridad de adelante es mía para entrar`,
    ],
    bridges: [
      `Cada versión de mí que se quedó
está en el espejo diciendo adiós
No les debo una disculpa
les debo el viaje`,
      `Si es un error es mi error
y lo voy a manejar hasta el final
Eso no es terquedad, es hacerme cargo
Por fin algo es mío`,
    ],
    breakdowns: [
      `Llave. Contacto. Respirar.
Toda la ceremonia es esa.`,
      `Sin cuenta atrás. Sin bendición.
Solo ir.`,
    ],
    outros: [
      `{title}, y la intermitente ya está puesta
No reviso el espejo dos veces
La carretera me quita la decisión
y la convierte en distancia`,
      `Nada está prometido aquí afuera, {title}
y nunca me sentí tan ligero
La salida aparece rápido
y la tomo`,
    ],
  },

  homecoming: {
    verses: [
      `{image}, y el pueblo puso un letrero nuevo
Todo es más pequeño y más cálido de lo que dejé
El {place} sigue con la misma luz fea
y jamás he estado tan contento por una luz
Manejé esta carretera a los diecisiete creyendo que llevaba lejos
Resulta que solo lleva`,
      `La misma curva donde aprendí lo que puede un coche
El mismo campo, la misma cerca, otro yo
Espero sentirme un extraño
y sigo sintiéndome solamente una persona
{person} en el porche, saludando antes de ver quién es —
eso es una riqueza que nadie cuenta`,
      `Traje de vuelta menos de lo que me llevé
y de algún modo las maletas pesan más
Cada kilómetro de allá valió la pena
y cada kilómetro de vuelta también
Nada es igual y nada está arruinado
Las dos cosas son buenas noticias`,
    ],
    pres: [
      `Y no vengo a quedarme, vengo a mirar
Hay una diferencia y me costó años`,
      `La carretera vieja conoce mis ruedas
No me pregunta dónde estuve`,
    ],
    choruses: [
      `Todo parece igual y nada lo es
y lo digo con cariño, lo digo como gracias
Pude ser aquella persona, en esta carretera,
y ahora puedo ser esta
La nostalgia no es un sitio al que vuelvo a mudarme
es una luz con la que manejo`,
      `Llévame por donde lo recuerdo
Que sea más chico, que esté gastado
No vengo a arreglar el pasado —
vengo a darle la mano
Lo que fuera que buscaba allá afuera
era en parte {dest}, y en parte esto`,
      `Va por la carretera que me crió
y por las carreteras que me sacaron de ella
El martes ya no estoy
y voy a ir agradecido todo el viaje
Puedes querer un lugar y aun así irte
Eso no es traición, es movimiento`,
    ],
    bridges: [
      `Creía que volver era fracasar
Ahora creo que es la forma de una vida:
salir y volver y salir de nuevo
como respirar, como marea`,
      `El chico que se fue sigue en el coche
viajando conmigo, callado, conforme
Le digo que salió bien
casi todo, desparejo, suficiente`,
    ],
    breakdowns: [
      `La misma luz del porche. Otros ojos.
Sigue encendida.`,
      `Nada me esperó.
Todo me recibió. Las dos cosas ciertas.`,
    ],
    outros: [
      `{title}, y la luz del porche se queda encendida detrás
Volveré antes de que importe
La carretera me lleva como siempre lo hizo
despacio, y sin preguntar`,
      `Con calma, {title}, con calma
El pueblo se hace chico y se queda tibio
Hay otra carretera pasando el tanque de agua
y ya la escucho llamar`,
    ],
  },
}

export const LYRIC_BANK: LyricBank = { en: EN, es: ES }
