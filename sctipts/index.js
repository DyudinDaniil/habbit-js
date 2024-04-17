'use strict';

const HABBIT_KEY = 'HABBIT_KEY';
let habbits = [];
let globalActiveHabbitId;


// page
const page = {
  menu: document.querySelector('.nav__list'),
  header: {
    h1: document.querySelector('.header__title'),
    progressPercent: document.querySelector('.progress__percent'),
    activeProgressBar: document.querySelector('.progress__active')
  },
  body: {
    content: document.querySelector('.habbits'),
    nextDay: document.querySelector('.add__day')
  }
  
}


// utils
function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const arrrayHabbits = JSON.parse(habbitsString);

  if (Array.isArray(arrrayHabbits)) {
    habbits = arrrayHabbits;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}


// render
function rerenderMenu(activeHabbit) {
  if (!activeHabbit){
    return;
  } 

  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    
    if (!existed) {
      const element = document.createElement('li');
      element.classList.add('nav__item');
      element.addEventListener('click', () => rerender(habbit.id));
      element.innerHTML = `<button class="nav__btn" menu-habbit-id="${habbit.id}">
      <img src="./images/${habbit.icon}.svg" alt="">
    </button>`;
       
      page.menu.appendChild(element);
      if (habbit.id === activeHabbit.id) {
        document.querySelector(`[menu-habbit-id="${habbit.id}"]`).classList.add('nav__btn_active');
      }
      continue;
    }

    if (habbit.id === activeHabbit.id) {
      existed.classList.add('nav__btn_active');
    } else {
      existed.classList.remove('nav__btn_active');
    }
  }
}

function renderHeader(activeHabbit) {
  if (!activeHabbit){
    return;
  } 

  const progress = activeHabbit.days.length / activeHabbit.target > 1
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100;

  page.header.h1.innerText = activeHabbit.name;
  page.header.progressPercent.innerText = `${progress}%`;
  page.header.activeProgressBar.setAttribute('style', `width: ${progress}%`);
}

function renderBody(activeHabbit) {
  if (!activeHabbit){
    return;
  } 

  page.body.content.innerHTML = '';

  activeHabbit.days.forEach((day, index) => {
    const element = document.createElement('li');
    element.classList.add('habbits__item')
    element.innerHTML = `<div class="habbits__day">
    День ${index + 1}
  </div>

  <div class="habbits__text">
    ${day.comment}
  </div>

  <button class="habbits__btn" onclick="deleteDay(${index})">
    <img src="./images/delete.svg" alt="">
  </button>`;
    page.body.content.appendChild(element);
  });

  page.body.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
  globalActiveHabbitId = activeHabbit.id;

  rerenderMenu(activeHabbit);
  renderHeader(activeHabbit);
  renderBody(activeHabbit);
}


// work with form
function addDay(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const comment = data.get('comment');
  form['comment'].classList.remove('error');

  if (!comment) {
    form['comment'].classList.add('error');
  } else {
    habbits = habbits.map(habbit => {
      if (habbit.id === globalActiveHabbitId) {
        return {
          ...habbit,
          days: habbit.days.concat([{ comment }])
        }
      }
  
      return habbit;
    });
  
    saveData();
    form['comment'].value = '';
    rerender(globalActiveHabbitId);
  }
}


// delete
function deleteDay(indexDay) {
  habbits = habbits.map(habbit => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.filter((day, index) => {
          if (index !== indexDay) {
            return day;
          }
        })
      }
    }

    return habbit;
  });

  saveData();
  rerender(globalActiveHabbitId);
}

//popup
function togglePopup() {
  const popup = document.querySelector('#add-habbit-popup');
  popup.classList.toggle('cover_hidden');
}

function setIcon(context, value) {
  const iconField = document.querySelector('.popup__form input[name="icon"]');
  iconField.value = value;

  const activeIcon = document.querySelector('.icon_active');
  activeIcon.classList.remove('icon_active');

  context.classList.add('icon_active');
}

function addHabbit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  const id = habbits.length + 1;
  const icon = data.get('icon');
  const name = data.get('name');
  const target = data.get('target');
  const newHabbit = {
    id,
    icon,
    name,
    target,
    days: []
  }

  habbits.push(newHabbit);
  saveData();
  rerender(globalActiveHabbitId);
  togglePopup();
}


// init
(() => {
  loadData();
  rerender(habbits[0].id);
  const bar = null;
  console.log(typeof bar === "object")
})()

