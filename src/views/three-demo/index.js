let camera, scene, renderer,
    geometry, material, mesh;

export function init() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    scene.add(camera);

    geometry = new THREE.CubeGeometry(200, 200, 200);
    material = new THREE.MeshLambertMaterial({ color: 0xaa6666, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    //scene.add( mesh );
    cubeSineDriver = 0;

    textGeo = new THREE.PlaneGeometry(300, 300);
    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    textTexture = THREE.ImageUtils.loadTexture('img/quickText.png');
    textMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff, opacity: 1, map: textTexture, transparent: true, blending: THREE.AdditiveBlending })
    text = new THREE.Mesh(textGeo, textMaterial);
    text.position.z = 800;
    scene.add(text);

    light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 1);
    scene.add(light);

    smokeTexture = THREE.ImageUtils.loadTexture('img/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({ color: 0x00dddd, map: smokeTexture, transparent: true });
    smokeGeo = new THREE.PlaneGeometry(300, 300);
    smokeParticles = [];


    for (p = 0; p < 150; p++) {
        var particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    document.body.appendChild(renderer.domElement);

}

export function animate() {

    // note: three.js includes requestAnimationFrame shim
    stats.begin();
    delta = clock.getDelta();
    requestAnimationFrame(animate);
    evolveSmoke();
    render();
    stats.end();
}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while (sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

function render() {

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    cubeSineDriver += .01;
    mesh.position.z = 100 + (Math.sin(cubeSineDriver) * 500);
    renderer.render(scene, camera);

}


function Stats() {

	var startTime = Date.now(), prevTime = startTime;
	var ms = 0, msMin = Infinity, msMax = 0;
	var fps = 0, fpsMin = Infinity, fpsMax = 0;
	var frames = 0, mode = 0;

	var container = document.createElement( 'div' );
	container.id = 'stats';
	container.addEventListener( 'mousedown', function ( event ) { event.preventDefault(); setMode( ++ mode % 2 ) }, false );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var fpsDiv = document.createElement( 'div' );
	fpsDiv.id = 'fps';
	fpsDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#002';
	container.appendChild( fpsDiv );

	var fpsText = document.createElement( 'div' );
	fpsText.id = 'fpsText';
	fpsText.style.cssText = 'color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	fpsText.innerHTML = 'FPS';
	fpsDiv.appendChild( fpsText );

	var fpsGraph = document.createElement( 'div' );
	fpsGraph.id = 'fpsGraph';
	fpsGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0ff';
	fpsDiv.appendChild( fpsGraph );

	while ( fpsGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#113';
		fpsGraph.appendChild( bar );

	}

	var msDiv = document.createElement( 'div' );
	msDiv.id = 'ms';
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;display:none';
	container.appendChild( msDiv );

	var msText = document.createElement( 'div' );
	msText.id = 'msText';
	msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML = 'MS';
	msDiv.appendChild( msText );

	var msGraph = document.createElement( 'div' );
	msGraph.id = 'msGraph';
	msGraph.style.cssText = 'position:relative;width:74px;height:30px;background-color:#0f0';
	msDiv.appendChild( msGraph );

	while ( msGraph.children.length < 74 ) {

		var bar = document.createElement( 'span' );
		bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
		msGraph.appendChild( bar );

	}

	var setMode = function ( value ) {

		mode = value;

		switch ( mode ) {

			case 0:
				fpsDiv.style.display = 'block';
				msDiv.style.display = 'none';
				break;
			case 1:
				fpsDiv.style.display = 'none';
				msDiv.style.display = 'block';
				break;
		}

	}

	var updateGraph = function ( dom, value ) {

		var child = dom.appendChild( dom.firstChild );
		child.style.height = value + 'px';

	}

	return {

		REVISION: 11,

		domElement: container,

		setMode: setMode,

		begin: function () {

			startTime = Date.now();

		},

		end: function () {

			var time = Date.now();

			ms = time - startTime;
			msMin = Math.min( msMin, ms );
			msMax = Math.max( msMax, ms );

			msText.textContent = ms + ' MS (' + msMin + '-' + msMax + ')';
			updateGraph( msGraph, Math.min( 30, 30 - ( ms / 200 ) * 30 ) );

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				fpsMin = Math.min( fpsMin, fps );
				fpsMax = Math.max( fpsMax, fps );

				fpsText.textContent = fps + ' FPS (' + fpsMin + '-' + fpsMax + ')';
				updateGraph( fpsGraph, Math.min( 30, 30 - ( fps / 100 ) * 30 ) );

				prevTime = time;
				frames = 0;

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		}

	}

};