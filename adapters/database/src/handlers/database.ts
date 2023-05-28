import { ClientSession, Connection, connect } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
  // eslint-disable-next-line vars-on-top, no-var
  var databaseConnection: Connection;
}

interface DatabaseProps {
  uri: string,
}

export type Session = ClientSession;

export type DatabaseConnection = Connection;

export class Database {
  private props: DatabaseProps;

  constructor(props: DatabaseProps) {
    this.props = props;
  }

  private async databaseConnect(): Promise<DatabaseConnection> {
    const { connection } = await connect(this.props.uri, {
      autoIndex: true,
    });

    return connection;
  }

  private async getConnection(): Promise<DatabaseConnection> {
    // eslint-disable-next-line no-var
    var connection: DatabaseConnection;

    if (process.env.NODE_ENV === 'production') {
      connection = await this.databaseConnect();
    } else {
      if (!globalThis.databaseConnection || globalThis.databaseConnection.readyState !== 1) {
        globalThis.databaseConnection = await this.databaseConnect();
      }

      connection = globalThis.databaseConnection;
    }

    return connection;
  }

  private static async closeConnection(connection: DatabaseConnection): Promise<void> {
    await connection.close();
  }

  public async startTransaction(): Promise<{
    session: Session,
    connection: DatabaseConnection,
  }> {
    const connection = await this.getConnection();

    const session = await connection.startSession();
    session.startTransaction();

    return {
      session,
      connection,
    };
  }

  // TODO: Fix
  public static async commitTransaction(session: Session, connection: DatabaseConnection): Promise<void> {
    await session.commitTransaction();
    await session.endSession();

    // await Database.closeConnection(connection);
  }

  public static async abortTransaction(session: Session, connection: DatabaseConnection): Promise<void> {
    await session.abortTransaction();
    await session.endSession();

    // await Database.closeConnection(connection);
  }
}
