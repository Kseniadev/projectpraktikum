import {api} from "./variables.js";
import {inputTypeName} from "./variables.js";
import {inputTypeLink} from "./variables.js";
import {userInfoName} from "./variables.js";
import {userInfoJob} from "./variables.js";
import {renderLoading} from "./renderLoading.js";
import {popupEditOpen} from "./variables.js";
import {userInfoAvatar} from "./variables.js";

export function addSubmitedInfo() {
    api.editAndSaveUserInfo(inputTypeName.value, inputTypeLink.value)
    /* Можно лучше: можно было написать без вложенности
                .then(res => console.log(res))
                .then(() => api.renderUserInfo())
                .then(result => {
                    userInfoName.textContent = result.name;
                    userInfoJob.textContent = result.about;
                    userInfoAvatar.style.backgroundImage = `url(${result.avatar})`;
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    renderLoading(false);
                    popupEditOpen.close()
                });*/
        .then(res => {
            console.log(res);
            api.renderUserInfo()
                .then(result => {
                    userInfoName.textContent = result.name;
                    userInfoJob.textContent = result.about;
                    userInfoAvatar.style.backgroundImage = `url(${result.avatar})`;
                })
                .catch((err) => {
                    console.log(err)
                });
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            renderLoading(false);
            popupEditOpen.close()
        });
}

