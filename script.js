let modalKey = 0

let quantPizzas = 1

let cart = []

//Funcoes auxiliares
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
	return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
	if(valor) {
		return valor.toFixed(2)
	}
}

const abrirModal = () => {
	seleciona('.pizzaWindowArea').style.opacity = 0
	seleciona('.pizzaWindowArea').style.display = 'flex'
	setTimeout(() => {
		seleciona('.pizzaWindowArea').style.opacity = 1
	}, 150)
}

const fecharModal = () => {
	seleciona('.pizzaWindowArea').style.opacity = 0
	setTimeout(() => {
		seleciona('.pizzaWindowArea').style.display = 'none'
	}, 500)
}

const botoesFechar = () => {
	selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
		item.addEventListener('click', fecharModal)
	})
}

const preencheDadosPizza = (pizzaItem, item, index) => {
	pizzaItem.setAttribute('data-key', index)
	pizzaItem.querySelector('.pizza-item--img img').src = item.img
	pizzaItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price[2])
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
	seleciona('.pizzaBig img').src = item.img
	seleciona('.pizzaInfo h1').innerHTML = item.name
	seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[2])
	seleciona('.pizzaInfo--desc').innerHTML = item.description
}

const pegarKey = (e) => {
	let key = e.target.closest('.pizza-item').getAttribute('data-key')

	quantPizzas = 1

	//Mantem informação da pizza clicada
	modalKey = key

	return key
}

const preencherTamanhos = (key) => {
	//Tira a seleção de tamanho atual e seleciona o grande
	seleciona('.pizzaInfo--size.selected').classList.remove('selected')

	//Seleciona todos os tamanhos
	selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
		//seleciona o tamanho grande
		(sizeIndex == 2) ? size.classList.add('selected') : ''
		size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
	})
}

const escolherTamanhoPreco = (key) => {
	//Ação nos botões de tamanho
	//Selecionar todos os tamanhos
	selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
		size.addEventListener('click', (e) => {
			
			//Tira a selecão do outro item e marca o clicado
			//Tira a seleção te tamanho atual e seleciona o grande
			seleciona('.pizzaInfo--size.selected').classList.remove('selected')

			//Marca o clicado
			size.classList.add('selected')

			//Muda o preço de acordo com o tamnho
			seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex])
		})
	})
}

const mudarQuantidade = () => {
	//Ações nos botões + e - do modal
	seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
		quantPizzas++
		seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
	})

	seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
		if(quantPizzas > 1) {
			quantPizzas--
			seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
		}
	})
}

const adicionarNoCarrinho = () => {
	seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
		//Tamanho
		let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key')

		//Preco
		let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')

		//Identificador que junta id e tamnho
		//Concatena as informações
		let identificador = pizzaJson[modalKey].id+'t'+size

		//Verifica se já tem no carrinho antes de adicionar
		//Adiciona quantidade
		let key = cart.findIndex( (item) => item.identificador == identificador)

		if (key > -1) {
			//Caso já possua, aumenta a quantidade
			cart[key].qt += quantPizzas
		} else {
			//Caso não, adiciona o objeto
			let pizza = {
				identificador,
				id: pizzaJson[modalKey].id,
				size,
				qt: quantPizzas,
				price: parseFloat(price)
			}

			cart.push(pizza)
		}

		fecharModal()
		abrirCarrinho()
		atualizarCarrinho()
	})
}

const abrirCarrinho = () => {
	if (cart.length > 0) {
		//Mostra carrinho
		seleciona('aside').classList.add('show')

		//Mostra barra superior
		seleciona('header').style.display = 'none' 
	}

	//Exibe aisde do carrinho (mobile)
	seleciona('.menu-openner').addEventListener('click', () => {
		if (cart.length > 0) {
			seleciona('aside').classList.add('show')
			seleciona('aside').style.left = '0'
			seleciona('header').style.display = 'none' 
		}
	})
}

const fecharCarrinho = () => {
	//Fecha o carrinho com o x (mobile)
	seleciona('.menu-closer').addEventListener('click', () => {
		seleciona('aside').style.left = '100vw'
		seleciona('header').style.display = 'flex'
	})
}

const atualizarCarrinho = () => {
	//Exibe número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length

	//Mostra ou não o carrinho
	if (cart.length > 0) {
		//Mostra o carrinho
		seleciona('aside').classList.add('show')

		//Zera .cart para não inserir duplicado
		seleciona('.cart').innerHTML = ''	

		//Variaveis
		let subtotal = 0
		let desconto = 0
		let total = 0

		for (let i in cart) {
			//Pegando item por id
			let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id )

			//Pega o subtotal a cada item
			subtotal += cart[i].price * cart[i].qt

			//Clona, exibe e depois preenche as informações
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let pizzaSizeName = cart[i].size

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

			//Preenche informações
			cartItem.querySelector('img').src = pizzaItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			//Seleciona os botões + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				//Adiciona apenas a quantidade neste contexto
				cart[i].qt++

				//Atualiza quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				if (cart[i].qt > 1) {
					//Subtrair quantidade neste contexto
					cart[i].qt--
				} else {
					//Remove se for zero
					cart.splice(i, 1)
				}

				(cart.length < 1) ? seleciona('header').style.display = 'flex' : '' 

				//Atualiza quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)
		}

		desconto = subtotal * 0
		total = subtotal - desconto

		//Exibe na tela os resultados
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML = formatoReal(total)
	} else {
		//Oculta carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
	seleciona('.cart--finalizar').addEventListener('click', () => {
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
		seleciona('header').style.display = 'flex'
	})
}

//Mapear pizzaJson para gerar lista de dados
pizzaJson.map((item, index) => {
	let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true)

	seleciona('.pizza-area').append(pizzaItem)

	//Preenche os dados de cada pizza
	preencheDadosPizza(pizzaItem, item, index)

	//Pizza clicada
	pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
		e.preventDefault()

		let chave = pegarKey(e)

		//Abre janela modal
		abrirModal()

		//Preenche os dados de cada pizza
		preencheDadosModal(item)

		//Prega o tamanho selecionado
		preencherTamanhos(chave)

		//Defini a quantidade inicial igual o padrao
		seleciona('.pizzaInfo--qt').innerHTML = quantPizzas

		//Seleciona o tamanho e o preco no clique
		escolherTamanhoPreco(chave)
	})

	botoesFechar()
})

mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()


