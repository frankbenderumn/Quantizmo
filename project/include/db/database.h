#ifndef DATABASE_H_
#define DATABASE_H_

#include <pqxx/pqxx>

class Database {
  public:
    Database() {
        C = new pqxx::connection("dbname=postgres user=root password=1234 \
                                    hostaddr=127.0.0.1 port=5432");
        if (C) {
            Console::Log(SUCCESS, "Connected to database: postgres");
        } else {
            Console::Log(FAILURE, "Failed to connect to database: postgres");
        }
    }
    Database(std::string name, 
            std::string role, 
            std::string password, 
            std::string host, 
            std::string port) {
        C = new pqxx::connection("dbname="+name+" user="+role+" password="+password +
                                "hostaddr="+host+" port="+port);
        if (C) {
            Console::Log(SUCCESS, "Connected to database "+name+" as "+role+"");
        } else {
            Console::Log(FAILURE, "Failed to connect to database "+name+"");
        }
    }

    void GetTables() {
        pqxx::work worker{*C};
        pqxx::result result = worker.exec("SELECT * FROM stocks;");
        for (auto const &row: result) {
            for (auto const &field: row) {
                std::cout << field.c_str() << '\t';
            }
            std::cout << std::endl;
        }
    }

  private:
    pqxx::connection* C;

    // pqxx::connection* C;

        // try {
        //     C = new pqxx::connection("dbname=postgres user=root password=1234 \
        //                                 hostaddr=127.0.0.1 port=5432");
            
        //     Console::Log(SUCCESS, "connection established");
        //     std::cout << "Connected to " << C->dbname() << '\n';
        // }
        
        // catch (const std::exception &e) {
        //     Console::Log(FAILURE, "Failed to connect to database");
        //     std::cerr << e.what() << std::endl;
        // }

        // try {
        //     // Connect to the database.
        //     std::cout << "Connected to " << C->dbname() << '\n';

        //     // Start a transaction.
        //     pqxx::work W{*C};

        //     // Perform a query and retrieve all results.
        //     pqxx::result R{W.exec("SELECT name FROM stock")};

        //     // Iterate over results.
        //     std::cout << "Found " << R.size() << "employees:\n";
        //     for (auto row: R)
        //         std::cout << row[0].c_str() << '\n';

        //     // Perform a query and check that it returns no result.
        //     std::cout << "Doubling all employees' salaries...\n";
        //     W.exec("UPDATE employee SET salary = salary*2");

        //     // Commit the transaction.
        //     std::cout << "Making changes definite: ";
        //     W.commit();
        //     std::cout << "OK.\n";
        // }
        
        // catch (std::exception const &e) {
        //     std::cerr << e.what() << '\n';
        //     return 1;
        // }
};

#endif