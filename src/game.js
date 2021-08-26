import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {WEBGL} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/WebGL.js';
import {graphics} from './graphics.js';

export const game = (function() {
  return {
    Game: class {
      constructor() {
        this._Initialize();
      }

      _Initialize() {
        this._graphics = new graphics.Graphics(this);  //그래픽 설정
        if (!this._graphics.Initialize()) {	// WebGL을 사용 못하는 경우
          this._DisplayError('WebGL2 is not available.');
          return;
        }

        this._previousRAF = null;

        this._OnInitialize();
        this._RAF();
      }

      _DisplayError(errorText) {
        const error = document.getElementById('error');
        error.innerText = errorText;
      }

      _RAF() {
        requestAnimationFrame((t) => { //timestamp값을 받아온다
          if (this._previousRAF === null) {
            this._previousRAF = t;
          }
          this._Render(t - this._previousRAF);
          this._previousRAF = t;
        });
      }

	  /**
	   * 렌더하기 위해 _RAF()에서 호출되는 메서드
	   * t(타임스탬프)를 이용해 _OnStep에서 0.1초보다 빠른 시점에 entity들을 업데이트함
	   * entity는 clouds가 될 수도, voxels가 될 수도 있는 것 같다.
	   */
      _Render(timeInMS) { 
        const timeInSeconds = timeInMS * 0.001;
        this._OnStep(timeInSeconds);
        this._graphics.Render(timeInSeconds);

        this._RAF();
      }
    }
  };
})();
