#ifndef TABLE_H_
#define TABLE_H_

#include <pqxx/pqxx>
#include "db/row.h"

class Table {
  public:
    Table(const std::string& name, const pqxx::result& result) {
        _name = name;
        for (const pqxx::tuple& r : result) {
            std::vector<pqxx::field> fields;
            for (pqxx::field f : r) {
                fields.push_back(f);
            }
            Row* row = new Row(fields);
            _rows.push_back(row);
        }
    }
    std::vector<Row*> All() const { return _rows; }
    void Insert() { printf("TODO\n"); }
    void Update() { printf("TODO\n"); }
    void Select() const { printf("TODO\n"); }
    void Delete() { printf("TODO\n"); }
    void Where(std::string attribute, std::string value) const {
        printf("TODO\n");
    }

    void Dump() const {
        for (auto row : _rows) {
            row->Dump();
            std::cout << std::endl;
        }
    }
   
  private:
    std::string _name;
    std::vector<Row*> _rows;
};

#endif