// OK / Cancel dialog styled like the changelog pop-up. Resolves true on OK;
// Cancel and Escape resolve false.
function confirmDialog(title: string, message: string): Promise<boolean> {
  return new Promise(resolve => {
    const dialog = document.createElement('dialog');
    dialog.id = 'tvp-confirm-dialog';

    const heading = document.createElement('h1');
    heading.textContent = 'TradingviewPlus';
    const subtitle = document.createElement('h3');
    subtitle.textContent = title;
    const text = document.createElement('p');
    text.textContent = message;

    const buttons = document.createElement('div');
    buttons.className = 'tvp-confirm-buttons';
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    const ok = document.createElement('button');
    ok.textContent = 'OK';
    buttons.append(cancel, ok);

    dialog.append(heading, subtitle, document.createElement('hr'), text, buttons);

    const finish = (result: boolean) => {
      dialog.close();
      dialog.remove();
      resolve(result);
    };
    ok.addEventListener('click', () => finish(true));
    cancel.addEventListener('click', () => finish(false));
    dialog.addEventListener('cancel', e => { e.preventDefault(); finish(false); });

    document.body.appendChild(dialog);
    dialog.showModal();
  });
}
