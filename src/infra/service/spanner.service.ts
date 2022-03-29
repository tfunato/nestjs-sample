import { Spanner } from '@google-cloud/spanner'
import { Injectable } from '@nestjs/common'
import { Database } from '@google-cloud/spanner/build/src/database'

@Injectable()
export class SpannerService {
  db: Database
  constructor(projectId: string, instanceId: string, databaseId: string) {
    const spanner = new Spanner({
      projectId: projectId,
    })
    const instance = spanner.instance(instanceId)
    const database = instance.database(databaseId)
    this.db = database
  }

  getSpanner(): Database {
    return this.db
  }
}
