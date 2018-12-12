import { BuildEvent, Builder, BuilderConfiguration, BuilderContext } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { CordovaBuildBuilderSchema } from '../cordova-build';
import { CordovaServeBuilderSchema } from './schema';
export declare class CordovaServeBuilder implements Builder<CordovaServeBuilderSchema> {
    context: BuilderContext;
    constructor(context: BuilderContext);
    run(builderConfig: BuilderConfiguration<CordovaServeBuilderSchema>): Observable<BuildEvent>;
    protected _getCordovaBuildConfig(cordovaServeOptions: CordovaServeBuilderSchema): Observable<BuilderConfiguration<CordovaBuildBuilderSchema>>;
}
export default CordovaServeBuilder;
