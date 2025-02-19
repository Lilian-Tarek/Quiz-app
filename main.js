// select elements
let countspan = document.querySelector(".count span");
let spanscontainer = document.querySelector(".bullets .spans");
let quizarea = document.querySelector(".quiz-area");
let ansarea = document.querySelector(".ans-area");
let submit = document.querySelector(".submit");
let bullets = document.querySelector(".bullets");
let finalresults = document.querySelector(".results");
let countdowncontainer = document.querySelector(".countdown");
let currentindex = 0;
let rightanswers = 0;
let countdowninterval;
//Json
function getquestions()
{
    let myreq = new XMLHttpRequest();
    myreq.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {
            let questionsobject = JSON.parse(this.responseText);
            let questionscount = questionsobject.length;
            createbullets(questionscount);
            addData(questionsobject[currentindex], questionscount);
            // start countdown
            countdown(5,questionscount);
            submit.onclick = function ()
            {
                // get right answer
                let rightanswer = questionsobject[currentindex].right_answer;
                // check answer
                checkans(rightanswer, questionscount);
                setTimeout(() => {
                      currentindex++;
                      // remove previous questions and answers
                      quizarea.innerHTML = "";
                      ansarea.innerHTML = "";
                      // next question
                      addData(questionsobject[currentindex], questionscount);
                      // handle bullet class
                      handlebulletsclass();
                      // countdown
                      clearInterval(countdowninterval);
                      countdown(5, questionscount);
                      // show results
                      showresults(questionscount);
                }, 1200);
              


                }
    }
    }
    myreq.open('GET', 'questions.json', true);
    myreq.send();
}
getquestions();
// create bullets
function createbullets(num)
{
    countspan.innerHTML = num;
    // create spans
    for (let i = 0; i < num; i++)
    {
        let thebullet = document.createElement("span");
        // chech if it is first span
        if (i==0)
        {
            thebullet.classList.add("on");
        }
        spanscontainer.appendChild(thebullet);



    }

}
// add data function

function addData(obj,count)
{
    if (currentindex < count)
    {
      //  create h2 title
      let questiontitle = document.createElement("h2");
      questiontitle.textContent = obj.title;
      quizarea.appendChild(questiontitle);
      // create the answers
      for (let i = 0; i < 4; i++) {
        let maindivans = document.createElement("div");
        maindivans.classList.add("answer");
        let radioinput = document.createElement("input");
        radioinput.type = "radio";
        radioinput.name = "answer";
        radioinput.id = `answer_${i + 1}`;
        radioinput.dataset.answer = obj[`answer_${i + 1}`];
        let answerlabel = document.createElement("label");
        answerlabel.htmlFor = `answer_${i + 1}`;
        answerlabel.textContent = obj[`answer_${i + 1}`];
        maindivans.appendChild(radioinput);
        maindivans.appendChild(answerlabel);
        ansarea.appendChild(maindivans);
        if (i === 0) {
          radioinput.checked = true;
        }
      }
    }

}
function checkans(rightans, count) {
  let answers = document.getElementsByName("answer");
  let chosen = null;
  let checkedlabel = null;
let checkedall=null;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosen = answers[i].dataset.answer;
        checkedlabel = answers[i].parentElement.querySelector("label");
        checkedall = answers[i];
       
    }
  }
  if (chosen === rightans) {
    rightanswers++;
    if (checkedlabel) {
        checkedlabel.style.color = " #009688"; 
        checkedall.style.accentColor = " #009688";
        checkedall.parentElement.style.border = "1px solid  #009688";
     
      
    }
  } else {
    if (checkedlabel) {
        checkedlabel.style.color = " #ff4c4c"; 
        checkedall.style.accentColor = " #ff4c4c";
            checkedall.parentElement.style.border = "1px solid  #ff4c4c";
    }
  }
}
function handlebulletsclass()
{
    let bulletspans = document.querySelectorAll(".bullets .spans span");   
    let arrofspans = Array.from(bulletspans);
    arrofspans.forEach((span, index) => {
        span.classList.remove("on");
        if (index == currentindex)
        {
            span.classList.add("on");
    
    }
    });
}

function showresults(count)
{
    let results;
    if (currentindex === count)
    {
        quizarea.remove();
        ansarea.remove();
        submit.remove();
        bullets.remove();
        if (rightanswers > count/2 && rightanswers < count)
        {
            results = `<span class='good'>Good</span>,Right answers:${rightanswers} from ${count}`;
            
        }
        else if (rightanswers === count)
        {
            results = `<span class='perfect'>Perfect</span>,Right answers:All answers`;
        }
        else
        {
            results = `<span class='bad'>Bad</span>,Right answers:${rightanswers} from ${count}`;
        }
        finalresults.innerHTML = results;
        finalresults.style.padding = "20px";
        finalresults.style.backgroundColor = "white";
        finalresults.style.margin = "20px auto";
        finalresults.style.textAlign = "center";
           finalresults.style.fontSize = "20px";
    }
}
function countdown(duration, count)
{
    if (currentindex<count)
    {
        let minutes, seconds;
        countdowninterval = setInterval(() => {
            
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10? `0${seconds}` : seconds;

            countdowncontainer.innerHTML = `${minutes} :${seconds}`;
            if (--duration <0)
            {
                clearInterval(countdowninterval);
                submit.click();
    }


        },1000);
    }
}