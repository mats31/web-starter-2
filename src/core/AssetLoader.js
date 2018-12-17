import States from 'core/States'
import OBJLoader from 'helpers/3d/OBJLoader/OBJLoader'
import GLTFLoader from 'helpers/3d/GLTFLoader/GLTFLoader'
import resources from 'config/resources'
import FontFaceObserver from 'fontfaceobserver'

class AssetLoader {

  constructor() {
    this.assetsToLoad = 0
    this.assetsLoaded = 0
    this.JSONS = []
    this.waitForJSON = false

    if (this.waitForJSON) {
      if (typeof resources.jsons !== 'undefined' && resources.jsons.length > 0) {
        this.assetsToLoad += resources.jsons.length
        this.loadJSONS(() => {
          const projects = this.JSONS[0].media.projects

          for (let i = 0; i < projects.length; i++) {
            const project = projects[i];

            if (project.type === 'image') {
              const object = {
                id: project.id,
                url: `images/projects/${project.id}/${project.id}.png`
              }

              resources.textures.push(object)
            } else {
              const object = {
                id: project.id,
                url: `videos/projects/${project.id}/${project.id}.mp4`
              }

              resources.videos.push(object)
            }
            
          }

          this._startLoading()
        })
      }
    } else {
      this._startLoading()
    }
  }

  _startLoading() {
    if (typeof resources.fonts !== 'undefined' && resources.images.length > 0) {
      this.assetsToLoad += resources.fonts.length
      this.loadFonts()
    }

    if (typeof resources.images !== 'undefined' && resources.images.length > 0) {
      this.assetsToLoad += resources.images.length
      this.loadImages()
    }

    if (typeof resources.textures !== 'undefined' && resources.textures.length > 0) {
      this.assetsToLoad += resources.textures.length
      this.loadTextures()
    }

    if (typeof resources.sounds !== 'undefined' && resources.sounds.length > 0) {
      this.assetsToLoad += resources.sounds.length
      this.loadSounds()
    }

    if (typeof resources.videos !== 'undefined' && resources.videos.length > 0) {
      this.assetsToLoad += resources.videos.length
      this.loadVideos()
    }

    if (typeof resources.models !== 'undefined' && resources.models.length > 0) {
      this.assetsToLoad += resources.models.length
      this.loadModels()
    }

    if (this.assetsToLoad === 0) Signals.onAssetsLoaded.dispatch(100)
  }

  loadFonts() {
    const fonts = resources.fonts

    for (let i = 0; i < fonts.length; i += 1) {

      this.loadFont(fonts[i]).then(() => {

        this.assetsLoaded += 1

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100
        Signals.onAssetLoaded.dispatch(percent)
        console.log(percent)
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent)
      }, (err) => {
        console.log(err)
      })
    }
  }

  loadFont(curFont) {
    return new Promise((resolve, reject) => {
      console.log(curFont.id)
      const font = new FontFaceObserver(curFont.id);

      font.load().then(() => {
        resolve()
      }, (err) => {
        reject('Error at the font loading:' + err)
      });
    })
  }

  loadImages() {
    const images = resources.images

    for ( let i = 0; i < images.length; i += 1 ) {

      this.loadImage( images[i] ).then( (image) => {

        States.resources.images.push( image )
        this.assetsLoaded += 1

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100
        Signals.onAssetLoaded.dispatch(percent)
        console.log(percent)
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent)
      }, (err) => {
        console.log(err)
      })

    }
  }

  loadImage(media) {
    return new Promise( ( resolve, reject ) => {
      const image = new Image()
      image.alt = media.description

      image.onload = () => {
        resolve( { id: media.id, media: image } )
      }

      image.onerror = () => {
        reject(`Erreur lors du chargement de l'image : ${image.src}`)
      }

      image.src = media.url
    })
  }

  loadTextures() {
    const textures = resources.textures

    for ( let i = 0; i < textures.length; i += 1 ) {

      this.loadTexture( textures[i] ).then( (texture) => {
        States.resources.textures.push( texture )
        this.assetsLoaded += 1

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100
        Signals.onAssetLoaded.dispatch(percent)
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent)
      }, (err) => {
        console.log(err)
      })

    }
  }

  loadTexture(media) {
    return new Promise( ( resolve, reject ) => {
      new THREE.TextureLoader().load(
        media.url,
        ( texture ) => {
          resolve( { id: media.id, media: texture } )
        },
        ( xhr ) => {
          console.log( `${( ( xhr.loaded / xhr.total ) * 100)} % loaded` )
        },
        ( xhr ) => {
          reject( `Une erreur est survenue lors du chargement de la texture : ${xhr}` )
        },
      )
    })
  }

  loadSounds() {
    const sounds = resources.sounds

    for (let i = 0; i < sounds.length; i++) {
      this.loadSound( sounds[i] ).then( (sound) => {
        States.resources.textures.push( sound )
        this.assetsLoaded += 1

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100
        Signals.onAssetLoaded.dispatch(percent)
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent)
      }, (err) => {
        console.log(err)
      })
    }
  }

  loadSound(media) {
    return new Promise( ( resolve, reject ) => {
      const sound = AudioController.createSound({
        id: media.id,
        url: media.url,
        useAnalyser: media.analyser,
      })

      sound.on('ready', () => {
        resolve( { id: media.id, media: sound } )
      })

      sound.on('error', () => {
        reject(`Une erreur est survenue lors du chargement du son : ${sound}`)
      })
    })
  }

  loadVideos() {
    const videos = resources.videos

    for ( let i = 0; i < videos.length; i += 1 ) {

      this.loadVideo( videos[i] ).then( (video) => {
        States.resources.videos.push( video )
        this.assetsLoaded += 1
        const percent = (this.assetsLoaded / this.assetsToLoad) * 100
        Signals.onAssetLoaded.dispatch(percent)
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent)
      }, (err) => {
        console.log(err)
      })

    }
  }

  loadVideo(media) {
    return new Promise( ( resolve, reject ) => {
      const video = document.createElement('video')

      video.oncanplaythrough = () => {
        resolve( { id: media.id, media: video } )
      }

      video.oncanplay = () => {
        resolve( { id: media.id, media: video } )
      }

      video.onloadedmetadata = () => {
        resolve( { id: media.id, media: video } )
      }

      video.onloadeddata = () => {
        resolve( { id: media.id, media: video } )
      }

      const interval = setInterval( () => {
        if ( video.readyState === 4 ) {
          clearInterval(interval)
          resolve( { id: media.id, media: video } )
        }
      }, 100)

      video.onerror = () => {
        reject(`Une erreur est survenue lors du chargement de la video : ${video}`)
      }

      video.src = media.url

    })
  }

  loadModels() {

    const models = resources.models

    for ( let i = 0; i < models.length; i += 1 ) {

      this.loadModel( models[i] ).then( (model) => {

        States.resources.models.push( model )
        this.assetsLoaded += 1

        const percent = (this.assetsLoaded / this.assetsToLoad) * 100
        Signals.onAssetLoaded.dispatch(percent)
        if (percent === 100) Signals.onAssetsLoaded.dispatch(percent)
      }, (err) => {
        console.error(err)
      })

    }
  }

  loadModel(model) {

    return new Promise( ( resolve, reject ) => {

      const ext = model.url.split('.').pop();


      switch (ext) {

        case 'obj': {
          const loader = new THREE.OBJLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            ( object ) => {

              resolve( { id: model.id, media: object, type: 'obj' } );
            },

            () => {},
            () => {
              reject('An error happened with the model import.');
            },
          );
          break;
        }

        case 'gltf': {
          const loader = new THREE.GLTFLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            (object) => {
              resolve({ id: model.id, media: object, type: 'gltf' });
            },

            () => {},
            () => {
              reject('An error happened with the model import.');
            },
          );
          break;
        }

        default: {
          const loader = new THREE.OBJLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            ( object ) => {
              resolve( { id: model.id, media: object, type: 'obj' } );
            },

            () => {},
            () => {
              reject('An error happened with the model import.');
            },
          );
        }
      }

    });
  }

  loadJSONS(callback) {
    const jsons = resources.jsons

    for (let i = 0; i < jsons.length; i += 1) {

      this.loadJSON(jsons[i]).then((json) => {

        this.JSONS.push(json)

        States.resources.jsons.push(json)
        this.assetsLoaded += 1

        if (this.waitForJSON) {
          callback()
        } else {
          const percent = (this.assetsLoaded / this.assetsToLoad) * 100
          Signals.onAssetLoaded.dispatch(percent)

          if (percent === 100) {
            Signals.onAssetsLoaded.dispatch(percent)
          }
        }
      }, (err) => {
        console.error(err)
      })

    }
  }

  loadJSON(media) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.overrideMimeType("application/json")
      request.open('GET', media.url, true)
      request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == "200") {
          resolve({ id: media.id, media: JSON.parse(request.responseText) })
        }
      }
      request.send(null)
    })
  }
}

export default new AssetLoader()
