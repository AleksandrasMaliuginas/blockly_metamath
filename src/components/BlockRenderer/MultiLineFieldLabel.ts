import Blockly, { FieldLabel } from "blockly";
import { FieldConfig } from "blockly/core/field";

class MultiLineFieldLabel extends FieldLabel {

  public static readonly NEW_LINE_INDICATOR = '\n';

  constructor(opt_value?: string, opt_class?: string, opt_config?: FieldConfig) {
    super(opt_value, opt_class, opt_config);
  }

  override initView() {
    super.initView();

    this.initMultilineView();
  }

  private initMultilineView() {
    if (!this.textElement_) return;

    // Remove single line field
    this.textElement_.innerHTML = "";

    let text = this.getText();

    text = text.replace(/ /g, Blockly.Field.NBSP);
    if (!text) {
      text = Blockly.Field.NBSP;
    }
    if (this.sourceBlock_ && this.sourceBlock_.RTL && text) {
      text += '\u200F';
    }

    const lines = text.split(MultiLineFieldLabel.NEW_LINE_INDICATOR);
    let dy = 0;
    lines.forEach((line, index) => {
      const tspanElement = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.TSPAN, { 'dy': dy, 'x': 0 }, this.textElement_);
      dy = this.getConstants()!.FIELD_TEXT_HEIGHT + 5;

      tspanElement.appendChild(document.createTextNode(line));
    });
  };

  override updateSize_(margin?: number) {
    const constants = this.getConstants();
    const xOffset = margin !== undefined ? margin :
      this.borderRect_ ? this.getConstants()!.FIELD_BORDER_RECT_X_PADDING : 0;
    const lines: string[] = this.getText().split(MultiLineFieldLabel.NEW_LINE_INDICATOR);

    // Set text width
    let totalWidth = xOffset * 2;
    let contentWidth = 0;
    if (this.textElement_) {
      const lineLengths: number[] = lines.map(line => {
        const lineElement = Blockly.utils.dom.createSvgElement(Blockly.utils.Svg.TEXT, {}, null);
        lineElement.textContent = line;

        return Blockly.utils.dom.getFastTextWidth(lineElement, constants!.FIELD_TEXT_FONTSIZE, constants!.FIELD_TEXT_FONTWEIGHT, constants!.FIELD_TEXT_FONTFAMILY);
      });

      contentWidth = Math.max(...lineLengths);
      totalWidth += contentWidth;
    }

    // Set text height
    let totalHeight = constants!.FIELD_TEXT_HEIGHT;
    if (this.borderRect_ && lines.length <= 1) {
      totalHeight = Math.max(totalHeight, constants!.FIELD_BORDER_RECT_HEIGHT);
    } else {
      totalHeight = (constants!.FIELD_TEXT_HEIGHT + 5) * lines.length;
    }

    this.size_.height = totalHeight;
    this.size_.width = totalWidth;

    this.positionTextElement_(xOffset, contentWidth);
    this.positionBorderRect_();
  }

  override positionTextElement_(xOffset: number, contentWidth: number) {
    super.positionTextElement_(xOffset, contentWidth);

    this.textElement_?.setAttribute('y', String(this.getConstants()!.FIELD_TEXT_BASELINE));
  }
}

export { MultiLineFieldLabel as MultiLineField }