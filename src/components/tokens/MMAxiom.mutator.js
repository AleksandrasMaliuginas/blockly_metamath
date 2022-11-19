import SymbolsDB from "../SymbolsDB";
import { MM, MMToken } from "../MMToken";
import { Extensions } from "blockly";


export class MMAxiom_mutator {

  static registerMutator() {

    Extensions.registerMutator(
      MM.Axiom + '_mutator',
      {
        // These are the serialization hooks for the lists_create_with block.
        saveExtraState: function () {
          return {
            'itemCount': this.itemCount_,
          };
        },

        loadExtraState: function (state) {
          this.itemCount_ = state['itemCount'];
          // This is a helper function which adds or removes inputs from the block.
          this.updateShape_();
        },


        // These are the decompose and compose functions for the lists_create_with block.
        decompose: function (workspace) {
          // This is a special sub-block that only gets created in the mutator UI.
          // It acts as our "top block"
          var topBlock = workspace.newBlock('lists_create_with_container');
          topBlock.initSvg();

          // Then we add one sub-block for each item in the list.
          var connection = topBlock.getInput('STACK').connection;
          for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
          }

          // And finally we have to return the top-block.
          return topBlock;
        },

        // The container block is the top-block returned by decompose.
        compose: function (topBlock) {
          // First we get the first sub-block (which represents an input on our main block).
          var itemBlock = topBlock.getInputTargetBlock('STACK');

          // Then we collect up all of the connections of on our main block that are
          // referenced by our sub-blocks.
          // This relates to the saveConnections hook (explained below).
          var connections = [];
          while (itemBlock && !itemBlock.isInsertionMarker()) {  // Ignore insertion markers!
            connections.push(itemBlock.valueConnection_);
            itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
          }

          // Then we disconnect any children where the sub-block associated with that
          // child has been deleted/removed from the stack.
          for (var i = 0; i < this.itemCount_; i++) {
            var connection = this.getInput('ADD' + i).connection.targetConnection;
            if (connection && connections.indexOf(connection) == -1) {
              connection.disconnect();
            }
          }

          // Then we update the shape of our block (removing or adding iputs as necessary).
          // `this` refers to the main block.
          this.itemCount_ = connections.length;
          this.updateShape_();

          // And finally we reconnect any child blocks.
          for (var i = 0; i < this.itemCount_; i++) {
            Blockly.Mutator.reconnect(connections[i], this, 'ADD' + i);
          }
        },
      },
      undefined,
      [MMAxiom, 'controls_if_else']);


      

  }
}