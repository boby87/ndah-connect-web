import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChildren } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpInputComponent {
  readonly length = input(6);
  readonly autoSubmit = input(true);
  readonly completed = output<string>();

  protected digits = signal<string[]>([]);
  private inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  ngOnInit(): void {
    this.digits.set(Array(this.length()).fill(''));
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '');
    const current = [...this.digits()];
    current[index] = val.charAt(0);
    this.digits.set(current);

    if (val && index < this.length() - 1) {
      const allInputs = this.inputs();
      if (allInputs[index + 1]) {
        allInputs[index + 1].nativeElement.focus();
      }
    }

    const code = current.join('');
    if (code.length === this.length() && this.autoSubmit()) {
      this.completed.emit(code);
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      const allInputs = this.inputs();
      if (allInputs[index - 1]) {
        allInputs[index - 1].nativeElement.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text')?.replace(/\D/g, '') ?? '';
    const digits = paste.substring(0, this.length()).split('');
    const current = Array(this.length()).fill('');
    digits.forEach((d, i) => current[i] = d);
    this.digits.set(current);

    if (digits.length === this.length() && this.autoSubmit()) {
      this.completed.emit(current.join(''));
    }
  }
}
