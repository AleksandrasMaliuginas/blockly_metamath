
export class WorkspaceInitializer {
  constructor(workspace) {
    this.workspace = workspace;
  }

  loadInitialState() {
    const workspace = this.workspace;

    const tpl = workspace.newBlock('tpl');
    const tt = workspace.newBlock('tt');
    const tze = workspace.newBlock('tze');
    
    tt.setFieldValue('term', 'CONST');
    tt.setFieldValue('t', 'VAR');
    tpl.getInput('V2').connection.connect(tt.outputConnection);
    tpl.getInput('V4').connection.connect(tze.outputConnection);


    const weq = workspace.newBlock('weq');
    const tt1 = workspace.newBlock('tt');
    tt1.setFieldValue('term', 'CONST');
    tt1.setFieldValue('t', 'VAR');

    // weq.getInput('V1').connection.connect(tpl.outputConnection);
    weq.getInput('V3').connection.connect(tt1.outputConnection);



    for (const block of [tpl, weq, tze, tt, tt1]) {
      block.initSvg();
      block.render();
    }
  }
}