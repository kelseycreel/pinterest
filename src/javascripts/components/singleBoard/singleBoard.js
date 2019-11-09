import $ from 'jquery';
import firebase from 'firebase';

import utilities from '../../helpers/utilities';
import smashData from '../../helpers/data/smash';
import boardData from '../../helpers/data/boardData';
import pinData from '../../helpers/data/pinData';

const buildSingleBoard = (oneBoard) => {
  let string = '';
  string += `<div id="${oneBoard.id}" class="card bg-dark text-white single-board">
  <div class="card-img-overlay">
    <h5 class="card-title">${oneBoard.name}</h5>
  </div>
  </div>`;
  return string;
};

const printEditandDeleteModal = (pinId, boardId) => {
  const { uid } = firebase.auth().currentUser;
  console.log(boardId);
  boardData.getListofBoards(uid)
    .then((boardlist) => {
      console.log(boardlist);
      let domString = '';
      domString += `<div class="modal fade hide" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Edit Pin</h5>
          <button type="button" id="close-modal" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="btn-group">
            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Small button
            </button>
            <div class="dropdown-menu">`;
      for (let i = 0; i < boardlist.length; i += 1) {
        domString += `<a class="dropdown-item" href="#">${boardlist[i]}</a>`;
      }
      domString += '</div></div>';
      domString += `<div class="modal-footer"><button id="${pinId}" data-dismiss="modal" type="button" class="btn btn-secondary delete-pin">Delete Pin
      </button><button type="button" class="btn btn-primary">Save changes</button></div>`;
      domString += '</div></div></div>';
      utilities.printToDom('modal', domString);
      $('.delete-pin').on('click', (() => {
        pinData.deletePinbyId(pinId)
          .then(() => {
            // eslint-disable-next-line no-use-before-define
            showSingleBoard(pinId, boardId);
            $('#board-zone').addClass('hide');
            $('#pin-zone').removeClass('hide');
          });
      }))
        .catch((error) => console.error(error));
    });
};

const showSingleBoard = (e) => {
  const counter = utilities.idGenerator();
  const boardId = e.target.id;
  let domString = '<div id="pin-zone" class="container">';
  smashData.getBoardNameForPins(boardId)
    .then((pins) => {
      domString += `<h2 class="pin-header">${pins.boardName}</h2>`;
      pins.forEach((pin) => {
        domString += `<div id="${pin.id}" class="card single-pin" style="width: 18rem;">
        <div class="card-img-overlay"><i data-toggle="modal" data-target="#exampleModalCenter" id="edit-${counter}" class="fas fa-pen edit-pin"></i></div>
        <img src="${pin.imageUrl}" class="card-img-top" alt="${pin.description}" />
        <div class="card-body"><h5 class="card-title" id="pin-${pin.boardId}">Board</h5></div>
        </div>`;
        printEditandDeleteModal(`${pin.id}`, `${pins.boardId}`);
      });
      domString += '</div>';
      utilities.printToDom('single-board', domString);
    })
    .catch((error) => console.error(error));
};

export default { buildSingleBoard, showSingleBoard, printEditandDeleteModal };
