/*
push();
querySelector();
setAttribute();
getAttribute();
createElement();
appendChild();
Math.random();
sort();
For loops
*/



document.addEventListener('DOMContentLoaded',() => {

	const cardArray = [
	{
		name: 'CA',
		img: 'MGimages/CA.png'
	},
	{
		name: 'CB',
		img: 'MGimages/CB.png'
	},
	{
		name: 'CC',
		img: 'MGimages/CC.png'
	},
	{
		name: 'CD',
		img: 'MGimages/CD.png'
	},
	{
		name: 'CE',
		img: 'MGimages/CE.png'
	},
	{
		name: 'CF',
		img: 'MGimages/CF.png'
	},
	]
})

const grid = document.querySelector('.grid')

function createBoard(){
	for (let i=0;i<13;i++){
		var card = document.createElement('img')
		card.setAttribute('src', "MGimages/ba.png")
		//card.setAttribute('data-id', i)
		//grid.appendChild(card)
	}
}

createBoard()



//card.addEventListener('click', flipcard)

