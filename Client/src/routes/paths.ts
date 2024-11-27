import { authPaths } from '@features/auth';
import { homePaths } from '@features/home';

export const paths = {
    app: {
        default: '/app'
    },
    home: homePaths,
    auth: authPaths
}