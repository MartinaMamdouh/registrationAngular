import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  pic: string = "../assets/images/pic.png"
  profile: string = "../assets/images/profile.png"
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(11),
    Validators.maxLength(11)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirm_password = new FormControl('', [
    Validators.required,

  ])
  showAlert = false
  alertMsg = 'please wait! your account is being created'
  alertColor = 'blue'
  inSubmission = false

  selectedImage: string = '';

  constructor(private http: HttpClient) { }

  match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName)
      const matchingControl = group.get(matchingControlName)

      if (!control || !matchingControl) {
        console.error('form control cant be found')
        return { controlNotFound: false }
      }

      const error = control.value === matchingControl.value ?
        null : { noMatch: true }

      matchingControl.setErrors(error)

      return error
    }
  }
  
  registrationForm = new FormGroup({
    name: this.name,
    phoneNumber: this.phoneNumber,
    email: this.email,
    password: this.password,
    confirm_password: this.confirm_password,

  }, [this.match('password', 'confirm_password')])

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    this.selectedImage = URL.createObjectURL(file);
    console.log(this.selectedImage);
  }

  register() {
    this.showAlert = true
    this.alertMsg = 'please wait! your account is being created'
    this.alertColor = 'blue'
    this.inSubmission = true

    if (this.registrationForm.valid) {
      // Extract form values
      const formData = new FormData();
      formData.append('fullName', this.name.value || '');
      formData.append('phoneNumber', this.phoneNumber.value || '');
      formData.append('email', this.email.value || '');
      formData.append('password', this.password.value || '');
      formData.append('imagePath', this.selectedImage);

      // Send HTTP POST request to PHP server
      this.http.post('http://localhost/registrationAngular/signup.php', formData, { responseType: 'text' })
        .subscribe({
          next: (response: any) => {
            console.log(response); // Handle success response
            alert(response)
            this.alertMsg = 'success! your account has been created'
            this.alertColor = 'green'
          },
          error: (error: HttpErrorResponse) => {
            console.error(error); // Handle error
            alert('An error occurred: ' + error.message)
            this.alertMsg = 'an unexpected error occurred. please try again later'
            this.alertColor = 'red'
            this.inSubmission = false
          }
        })
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

}

