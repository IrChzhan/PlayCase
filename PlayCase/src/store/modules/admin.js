export default {
    namespaced: true,
    state(){
        return {
            data:[]
        }
    },
    mutations:{

    },
    actions:{
        createFile({commit, state}, payload){
            const storageRef = firebase.storage().ref()
            const final =storageRef.child(`images/${payload[1]}/${payload[0].name}`)
            const task = final.put(payload[0])
            console.log(task)
            task.on('state_changed',

                function progress(progress){

                    console.log(progress.bytesTransferred / progress.totalBytes *100)
                },
                function error(err){
                    console.log('There was An Err ' + err)
                },
                function completed(){
                    final.getDownloadURL()
                        // RETURN A PROMISE
                        .then(url=>{
                            // SELECTING THE BODY AND APPENDING AN IMG TAG WITH  THE URL
                            state.data.push(url)
                        })
                }
            )
        }
    },
    getters:{

    }
}