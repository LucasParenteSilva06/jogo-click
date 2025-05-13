let pontos = 0;
let tempoRestante = 30;

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('fundo', 'assets/imagens/background.png');
    this.load.image('alvo', 'assets/imagens/target.png');
    this.load.audio('click', 'assets/audios/click.mp3');
  }

  create() {
    // Mostrar botão HTML
    const botao = document.getElementById('botao-jogar');
    botao.style.display = 'block';

    botao.onclick = () => {
      botao.style.display = 'none';
      this.scene.start('MainScene');
    };
  }
}

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    pontos = 0;
    tempoRestante = 30;

    this.add.image(400, 300, 'fundo').setDisplaySize(800, 600);
    this.somClick = this.sound.add('click');

    this.textoPontos = this.add.text(20, 20, 'Pontos: 0', { fontSize: '24px', fill: '#fff' });
    this.textoTempo = this.add.text(650, 20, 'Tempo: 30', { fontSize: '24px', fill: '#fff' });

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        tempoRestante--;
        this.textoTempo.setText('Tempo: ' + tempoRestante);
        if (tempoRestante <= 0) this.terminarJogo();
      },
      loop: true
    });

    this.intervaloAlvo = this.time.addEvent({
      delay: 1000,
      callback: () => this.criarAlvo(),
      loop: true
    });
  }

  criarAlvo() {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(100, 550);
    const alvo = this.add.image(x, y, 'alvo').setInteractive();

    alvo.on('pointerdown', () => {
      this.somClick.play();
      pontos += 10;
      this.textoPontos.setText('Pontos: ' + pontos);
      alvo.destroy();
    });

    this.time.delayedCall(1000, () => {
      if (alvo.active) alvo.destroy();
    });
  }

  terminarJogo() {
    this.intervaloAlvo.remove(false);
    this.add.rectangle(400, 300, 400, 200, 0x000000, 0.7);
    this.add.text(400, 250, 'Fim do Jogo!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    this.add.text(400, 300, 'Pontuação final: ' + pontos, { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);

    const botaoReiniciar = this.add.text(400, 370, 'Jogar Novamente', {
      fontSize: '24px',
      fill: '#0f0',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    botaoReiniciar.on('pointerdown', () => {
      this.scene.start('MainScene');
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-container',
  scene: [BootScene, MainScene]
};

const jogo = new Phaser.Game(config);
