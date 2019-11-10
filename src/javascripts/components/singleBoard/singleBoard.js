import $ from 'jquery';
import firebase from 'firebase';
import 'bootstrap';

import picture from './add-new.png';
import utilities from '../../helpers/utilities';
import smashData from '../../helpers/data/smash';
import boardData from '../../helpers/data/boardData';
import pinData from '../../helpers/data/pinData';

import './singleBoard.scss';

const buildSingleBoard = (oneBoard) => {
  let string = '';
  string += `<div id="${oneBoard.id}" class="card bg-dark text-white single-board">
  <div>
    <h5 class="card-title">${oneBoard.name}</h5>
    <a id="deleteBoard-${oneBoard.id}" class="delete-board-link" href="#">Delete board</a>
  </div>
  </div>`;
  return string;
};

const deletePin = (pinId, boardId) => {
  pinData.deletePinbyId(pinId)
    .then(() => {
      // eslint-disable-next-line no-use-before-define
      showSingleBoard(boardId);
    })
    .catch((error) => console.error(error));
};

const updatePin = (e) => {
  const pinId = e.target.id.split('-save-')[0];
  const newBoardId = e.target.getAttribute('data-set-id');
  console.log('update pin', pinId, newBoardId);
  pinData.preUpdatePin(pinId, newBoardId);
};

const ModalPinClick = (e) => {
  if (e.target.id.includes('save')) {
    console.log('coming in here');
    $('.dropdown-item-update').on('click', '.dropdown-item', updatePin);
    $('#exampleModalCenter').modal('hide');
  } else {
    const pinId = e.target.id.split('-split-')[0];
    const boardId = e.target.id.split('-split-')[1];
    deletePin(pinId, boardId);
    $('#exampleModalCenter').modal('hide');
  }
};

const printEditandDeleteModal = (e) => {
  e.stopImmediatePropagation();
  const boardId = e.target.getAttribute('data-boardId');
  const pinId = e.target.getAttribute('data-pinId');
  const { uid } = firebase.auth().currentUser;
  boardData.getListofBoards(uid)
    .then((boards) => {
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
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Change Board
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenu2">`;
      for (let i = 0; i < boards.length; i += 1) {
        domString += `<button class="dropdown-item dropdown-item-update" type="button" data-set-id=${boards[i].id}>${boards[i].name}</button>`;
      }
      domString += '</div></div>';
      domString += `<div id="modal-buttons-div" class="modal-footer">
        <button id="${pinId}-split-${boardId}" data-dismiss="modal" type="button" class="btn btn-secondary delete-pin">Delete Pin</button>
        <button id="${pinId}-save-${boardId}" type="button" class="btn btn-primary save-changes">Save changes</button>
        </div>`;
      domString += '</div></div></div>';
      utilities.printToDom('modal', domString);
      $('#exampleModalCenter').modal('show');
      $('#modal-buttons-div').on('click', '.delete-pin', ModalPinClick);
      $('#modal-buttons-div').on('click', '.save-changes', ModalPinClick);
    })
    .catch((error) => console.error(error));
};

const showSingleBoard = (boardId) => {
  let domString = '<div id="pin-zone" class="container">';
  domString += `<div id="addNewPin" class="card single-pin add-single-pin" style="width: 18rem;">
        <div id="newpin-${boardId}" data-toggle="modal" data-target="#newPinModal" class="card-img-overlay"></div>
        <img src="${picture}" class="card-img-top" alt="add-image" />
        <div class="card-body"><h5 class="card-title">Add Pin</h5></div>
        </div>`;
  smashData.getBoardNameForPins(boardId)
    .then((pins) => {
      pins.forEach((pin) => {
        domString += `
        <div id="${pin.id}" class="card single-pin" style="width: 18rem;">
          <div class="card-img-overlay">
            <i data-toggle="modal" data-target="#exampleModalCenter" id="${pin.boardId}-split-${pin.id}" data-pinId=${pin.id} data-boardId=${pin.boardId} class="fas fa-pen edit-pin"></i>
          </div>
          <img src="${pin.imageUrl}" class="card-img-top" alt="${pin.description}" />
          <div class="d-flex justify-content-between card-body"><h5 class="card-title" id="pin-${pin.boardId}">Add Comment</h5><i class="fas fa-plus"></i>
          </div>
        </div>`;
      });
      domString += '</div>';
      $('#single-board-button').find('#close-board').show();
      utilities.printToDom('board-zone', domString);
      $('.single-pin').on('click', '.edit-pin', printEditandDeleteModal);
    })
    .catch((error) => console.error(error));
};

const clickMiddle = (e) => {
  e.stopImmediatePropagation();
  const boardId = e.target.id;
  showSingleBoard(boardId);
};

export default {
  buildSingleBoard,
  showSingleBoard,
  printEditandDeleteModal,
  clickMiddle,
};
