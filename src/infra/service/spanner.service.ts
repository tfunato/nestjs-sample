import { Spanner } from '@google-cloud/spanner'
import { Injectable, Logger } from '@nestjs/common'
import { Database } from '@google-cloud/spanner/build/src/database'

@Injectable()
export class SpannerService {
  private readonly logger = new Logger(SpannerService.name)
  private readonly db: Database
  constructor() {
    const projectId: string = process.env.SPANNER_PROJECT_ID
    const instanceId: string = process.env.SPANNER_INSTANCE_ID
    const databaseId: string = process.env.SPANNER_DATABASE_ID
    this.logger.log('projectId:' + projectId)
    this.logger.log('instanceId:' + instanceId)
    this.logger.log('databaseId:' + databaseId)
    this.logger.log('emulator host:' + process.env.SPANNER_EMULATOR_HOST)
    const spanner = new Spanner({ projectId })
    const instance = spanner.instance(instanceId)
    this.db = instance.database(databaseId)
  }

  getDb(): Database {
    return this.db
  }
}
