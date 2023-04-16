// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { AuthOwner } from 'src/modules/auth/guard/authOwner.guard';
// import { AuthAdmin } from 'src/modules/auth/guard/authAdmin.guard';


// @Injectable()
// export class AuthOwnerAdmin implements CanActivate {
//   constructor(
//     private readonly authOwner: AuthOwner,
//     private readonly authAdmin: AuthAdmin,
//   ) { }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     return (
//       await this.authOwner.canActivate(context)? true :
//       await this.authAdmin.canActivate(context)? true : false
//     )
//   }
// }
