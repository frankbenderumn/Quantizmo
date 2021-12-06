#ifndef DATABASE_H_
#define DATABASE_H_

#include <pqxx/pqxx>
#include <unordered_map>
#include "db/table.h"

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

    ~Database() {
        printf("destroying database instance\n");

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

    /* mutates database */
    void GetTable(std::string name) {
        pqxx::work worker{*C};
        bool commited = true;
        pqxx::result res;
        try {
            res = worker.exec("SELECT * FROM " + name + ";");
        } 
        catch (const pqxx::undefined_table& e) {
            Console::Log(FAILURE, "Undefined table on query: " + e.query());
            Console::Log(FAILURE, "Table does not exist: " + name);
            commited = false;
        }

        if (commited) {
            std::cout << res.size() << std::endl;

            if (!IsTable(name)) {
                Console::Log(INFO, "Adding table " + name + " to memory...");
                AddTable(name, res);
            }

            // for (int i = 0; i < res.size(); i++) {
            // pqxx::tuple row = res.at(0);
            // std::cout << row.size() << std::endl;
            // std::cout << row.at(0) << " -- " << row.at(1) << " -- " << row.at(2) << std::endl;
            // pqxx::field c = row.at(1);
            // std::cout << c.c_str() << std::endl;
            // for (auto const &field: row) {
            //     std::cout << field.c_str() << '\t';
            // }
            // std::cout << std::endl;

        }
    }

    bool IsTable(std::string key) const {
        return (_tables.find(key) != _tables.end());
    }

    void AddTable(std::string name, pqxx::result rows) {
        Table* table = new Table(name, rows);
        table->Dump();
        Console::Log(SUCCESS, "Successfully added table " + name + " to memory.");
        _tables[name] = table;
    }

    void Print() { printf("TODO: needed for persistent data\n"); }


  private:
    pqxx::connection* C;
    std::unordered_map<std::string, Table*> _tables;

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
        
};

#endif