class Block {
    constructor(prevHash, txs, nonce) {
        this.prevHash = prevHash;
        this.txs = txs;
        this.nonce = nonce;
        this.time = Date.now();
    }

    getHash() {
        return CryptoJS.SHA256(
            this.prevHash + 
            this.getMerkleHash() + 
            this.nonce + 
            this.time
        ).toString();
    }

    getMerkleHash() {
        const txHash = CryptoJS.SHA256(this.txs.join('')).toString();
        return txHash;
    }
}

class Blockchain {
    constructor(genesisBlock) {
        this.blocks = {};
        this.blocks[genesisBlock.getHash()] = genesisBlock;
    }

    mineBlock() {
        let nonce = Math.floor(Math.random() * 1000) + 1;
        const transactions = [
            CryptoJS.SHA256(Date.now().toString()).toString(),
            CryptoJS.SHA256((Date.now() + 1).toString()).toString()
        ];
        let block = new Block(this.getLastBlock().getHash(), transactions, nonce);
        this.blocks[block.getHash()] = block;
        return block;
    }

    getLastBlock() {
        let keys = Object.keys(this.blocks);
        return this.blocks[keys[keys.length - 1]];
    }

    getAllBlocks() {
        return Object.values(this.blocks);
    }
}

// Initialisation de la blockchain
const genesisBlock = new Block(null, ['genesis', 'block'], 1);
const blockchain = new Blockchain(genesisBlock);

// Variables pour le minage automatique
let miningInterval = null;

// Fonction pour afficher un bloc
function displayBlock(block) {
    const blockElement = document.createElement('div');
    blockElement.className = 'block';
    
    const square = document.createElement('div');
    square.className = 'block-square';
    blockElement.appendChild(square);
    
    blockElement.innerHTML += `
        <h3>Bloc ${block.getHash()}</h3>
        <div class="block-info">
            <strong>Précédent bloc</strong>
            <span>${block.prevHash || 'Genesis'}</span>
        </div>
        <div class="block-info">
            <strong>Date</strong>
            <span>${block.time}</span>
        </div>
        <div class="block-info">
            <strong>Transactions</strong>
            <span>${block.txs.join('<br>')}</span>
        </div>
    `;
    return blockElement;
}

// Fonction pour mettre à jour l'affichage
function updateBlockchainDisplay() {
    const blockchainDiv = document.getElementById('blockchain');
    blockchainDiv.innerHTML = '';
    blockchain.getAllBlocks().forEach(block => {
        blockchainDiv.prepend(displayBlock(block));
    });
}

// Fonction pour miner un bloc
function mineOneBlock() {
    const newBlock = blockchain.mineBlock();
    updateBlockchainDisplay();
}

// Fonction pour démarrer/arrêter le minage automatique
function startAutoMining() {
    const button = document.querySelector('.controls button:first-child');
    if (miningInterval) {
        clearInterval(miningInterval);
        miningInterval = null;
        button.textContent = 'Démarrer la génération automatique';
        button.classList.remove('active');
    } else {
        miningInterval = setInterval(mineOneBlock, 2000);
        button.textContent = 'Arrêter la génération automatique';
        button.classList.add('active');
    }
}

// Affichage initial
updateBlockchainDisplay();