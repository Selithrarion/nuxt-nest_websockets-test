import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}

export default JwtRefreshGuard;
