# Dokumentacija za *Projekt 1*
Predmet: Infrastrukture i servisi u oblaku

Student: Alejna Hodzic

Ak. godina: 2025/2026.

---

### 1. Opis aplikacije

>[!IMPORTANT]
> ***Aplikacija predstavlja jednostavnu implementaciju todo lista zadataka bez potrebe registracije.***

Glavne funkcionalnosti aplikacije su:
- Moguce je grupisati zadatke po svrsi odnosno u liste zadataka.
- Svaka lista zadataka je nezavisna i moze se brisati kada je zavrseno koristenje iste.
- Dodavanje zadatka podrazumjeva i definisanje njegovog prioriteta u TOJ listi po kojem se sortiraju
*nezavrseni* zadaci.
- Zadaci se iznacavaju kao zavrseni pomocu checkboxa.
- Zavrseni zadaci idu na donji dio liste i sortiraju se po vremenu "izvrsavanja".
- Zadatke je moguce brisati neovisno o tome da li su zavrseni ili ne.
- Nema registracije. Aplikacija pri pokretanju korisniku dodijeli jedinstven ***session code*** 
pomocu kojeg korisnik moze da nastavi koristiti svoje kreirano okruzenje na drugim pretrazivacima
ili uredjajima ili nakon duzeg vremena preko `Reload Your tasks` button-a i session code-a.
- Sve radnje korisnika se automatski spremaju u bazu podataka na backendu tako da zatvaarnjem
pretrazivaca nece doci do gubitka podataka vec ce isti biti ucitani iz baze (filtrirano po
session code-u koji korisnik dobije).

---

### 2. Link repozitorija

Repozitorij aplikacije u kom se nalazi sva funkcionalnost ukljucujuci i fajlove za dokerizaciju:
- Dockerfile
- docker-compose.yaml

kao i sve skripte za pripremu, pokretanje, zaustavljanje i brisanje podataka aplikacije moguce je
naci na sljedecim linkovima:
1. [HTTPS](https://github.com/alejna-hodzic/projekt1-ISO.git)
2. [SSH](git@github.com:alejna-hodzic/projekt1-ISO.git)

---

### 3. Softverski preduslovi

- **DOCKER** => `Docker version 29.4.0`
- **Docker compose** => `Docker Compose version v5.1.1`
- **OS** => `VERSION="24.04.4 LTS (Noble Numbat)"`
- **Git** => `git version 2.43.0`

---

### 4. Arhitektura aplikacije
```
PROJEKT1-ISO/
├── backend/                
│   ├── config/            
│   │   └── config.go
│   ├── db/                
│   │   └── database.go
│   ├── http/               
│   │   ├── handlers.go
│   │   └── http.go
│   ├── types/              
│   │   └── types.go
│   └── main.go            
├── db/                    
│   └── db_setup.sql       
├── frontend/              
│   ├── app.js             
│   ├── index.html         
│   └── style.css          
├── .env                   
├── .gitignore             
├── go.mod                 
└── go.sum                
```

Backend: 
- Go programski jezik 
- modularan pristup:
  - HTTP logika odvojena od pristupa bazi podataka

Frontend: 
- HTML/CSS/JS
- komunicira s backend API-jem

Db: 
- db_setup.sql 
  - rekreaciju sheme baze podataka

---

### 5. Opis servisa, mreza i volumena


---

### 6. Upute za pokretanje


---

### 7. Nacin pristupa aplikaciji
URL:

Portovi:

---

### 8. Koristenje AI alata

### Koristeni AI alati:
1. Google Gemini
2. Github Copilot
3. Claude AI

### AI, promptovi i da li je rjesenje prihvaceno ili izmjenjeno:

---

AI: 
- Github Copilot
> Im starting to work on developing a web app which will be (for now) a simple to do app where user 
> can add lists of tasks and tasks to the list. I will be using HTML, CSS and JavaScript for 
> frontend and Go for backend, and will have MySQL database to store tasks. 
> For now I will just focus on frontend and ask questions about it. I want to design a list of 
> tasks as a card of a sort. (Similar to how Composable design works when using Jetpack compose 
> while building mobile app). How can i have the same thing in frontend when developing a web app?

Rjesenje: izmjenjeno. Generisano je kako se takva funkcija pise i ista je prilagodjena
potrebama aplikacije. Na slican nacin su odradjene i ostale funkcije istog tipa uz povremenu
pomoc AI u debagiranju. (Tesko je naci bug kada nema syntax highlightinga)


---

AI: 
- Gihub Copilot
> I made this function for making button (card) to add list of tasks
> ```
> function addListCardButton() {
> const addCardButton = document.createElement('div');
> addCardButton.className = 'add-list-card-btn ui card';
>    addCardButton.innerHTML = 
>        <div class="content">
>            <i class="huge plus icon"></i> <p>Add Task List</p>
>        </div>
>    ;
> return addCardButton;
> }
> ```
> is it possbile to when initially the page is loaded for it to be centered and bigger, but once 
> the first list is added for it to be smaller and to the right of the added list?

Rjesenje: CSS - prihvacen, js i html izmjenjeni.

---

AI:
- Google gemini
> Ostali promptovi koji se ticu CSS-a, centriranja divova, kartica i poboljsanja izleda.

Rjesenje: prihvaceno i/ili izmjenjeno

---

AI:
- Google Gemini
> I want a custom pop up when Add Task List is clicked, not this one implemented by browser. 
> How do i make that? I needs to take a name of the list that should be unique, and after confirmation
> to add the task list and move Add button to the right. If screen width is overflown it should
> be scrollable.

Rjesenje: Prihvaceno za inicijalni modal, ali izmjenjeno za sve ostale modale (za dodavanje 
taskova, konfirmaciju brisanja i restore-anja sesije)

---

AI: 
- svi prethodno navedeni, jer nisu mogli da rijese problem
> im having an issue that is displayed on the image. when i add task to the list it is rendered at 
> the center and as im adding more tasks the first one is slowly moving up. that is not the 
> desired behaviour and i cannot fix it however ive tried so far. I want tasks to be added top 
> down - first one to appear right below add task button and not move from that position as i add 
> other tasks (if the priorities are the same) but other tasks should go below it!!! ive tried 
> fixing it through css but im failing to do so. I just want tasks to render top down one by one as
> is normal expected behavior in such task lists. if i add enough tasks the space will fill up, but thats 
> not what i want, i want it to go from right under the add task button to end of the card. 
> another thing is, i want the card to stay the size it is, if i add loads of tasks IS SHOULDNT 
> expand in hight (which it does) it should wrap and add a scrollba.

Rjesenje: prihvaceno (CSS)

---

AI:
- Google Gemini 
> after the tasks are added is it better to sort them here on frontend, right? how would that be done if i want to sort
> them under different criteria? i want uncompleted tasks to be sorted by priority and completed 
> by time when theyre completed, but for them to be separated, what should i use?

Rjesenje: Prihvaceno

---

AI:
- Google Gemini
>which go package should i be using to create routs on my backend? is go-chi good package? and what functions should i be 
> using them and how do they work?

Rjesenje: Izmjenjeno

---

AI:
- Google Gemini
> i need help with writing my handler function, it keeps failing and im not sure why. what am i missing and how do i fix it? 
> heres the file with the function

Rjesenje: Prihvaceno - dodan ApiHandler struct i ispravljen odgovor frontendu

---

AI:
- Google Gemini
> slika iz console log-a.

Rjesenje: prihvaceno => problem je bio CORS pravila. (Iskreno ne znam na koji nacin se ovo rijesilo
ali jeste, dodan je kod s pocetka http.go fajla)

---

AI:
- Google gemini
> for some reason loading data from database doesnt work. when i refresh my webpage it gives 
> me empty space as if i have
> no entries. Here is how backend and frontend communicate, im not sure what to fix

Rjesenje: Prihvaceno (debugging) => slicni promptovi ovom su se javili i kasnije za js kod. Async
funkcije su bile nepotpune i dopunjene sa strane AI alata (nisam znala sta je greska).

---

AI:
- Google Gemini
> is there a way to trigger refresh of the page once session code is entered?
> because tasks and task lists dont appear untill its refreshed, but i would like to so
> that through code and not for users to manually do it.

Rjesenje: prihvaceno (zamijenjeno 20 linija koda s JEDNOM :'()


---

AI:
- Google Gemini
> Ispisi mi strukturu aplikacije na osnovu ove slike strukture direktorija!

Rjesenje: prihvaceno (iznad)
